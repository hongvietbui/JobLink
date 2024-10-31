using System.Linq.Expressions;
using System.Security.Claims;
using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.All.Job;
using JobLink_Backend.DTOs.Request.Jobs;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.DTOs.Response.Jobs;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities;
using JobLink_Backend.Utilities.Jwt;
using JobLink_Backend.Utilities.Pagination;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace JobLink_Backend.Services.ServiceImpls;

public class JobServiceImpl(IUnitOfWork unitOfWork, IMapper mapper, JwtService jwtService) : IJobService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IMapper _mapper = mapper;
    private readonly JwtService _jwtService = jwtService;

    public async Task<JobDTO?> GetJobByIdAsync(Guid jobId)
    {
        var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobId);
        return _mapper.Map<JobDTO>(job);
    }

    public async Task<string> GetUserRoleInJobAsync(Guid jobId, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;

        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        var jobList = await _unitOfWork.Repository<Job>().FindByConditionAsync(filter: j => j.Id == jobId, include: j => j.Include(j => j.Owner).Include(j => j.JobWorkers).ThenInclude(j => j.Worker));
        var job = jobList.FirstOrDefault();

        if (job == null)
        {
            throw new Exception("Job not found.");
        }

        //get ownerId by userId
        var owner = await _unitOfWork.Repository<JobOwner>().FirstOrDefaultAsync(jo => jo.UserId == userId);
        //get workerId by userId
        var worker = await _unitOfWork.Repository<Worker>().FirstOrDefaultAsync(w => w.UserId == userId);
        //Check if user is owner of job
        if (owner!= null && job.OwnerId == owner.Id)
        {
            return "JobOwner";
        }

        if (worker!=null && job.JobWorkers.Any(jw => jw.WorkerId == worker.Id))
        {
            return "Worker";
        }

        return null;
    }

 public async Task<Pagination<JobDTO>> GetJobsAsync(int pageIndex, int pageSize, string sortBy, bool isDescending, Expression<Func<Job, bool>>? filter = null)
{
    var jobRepository = _unitOfWork.Repository<Job>();
    var userRepository = _unitOfWork.Repository<User>();

   
    filter ??= job => true;

    IQueryable<Job> query = jobRepository.GetAll(filter);

    if (!string.IsNullOrEmpty(sortBy))
    {
        query = ApplySorting(query, sortBy, isDescending);
    }

    var totalItems = await jobRepository.CountAsync(filter);

    var paginatedJobs = await query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync();

    var viewJobDtos = paginatedJobs.Select(job => new JobDTO
    {
        Id = job.Id,
        Name = job.Name,
        Description = job.Description,
        Price = job.Price,
        OwnerId = job.OwnerId,
        Address = job.Address,
        Lat = job.Lat,
        Lon = job.Lon,
        Status = job.Status.GetStringValue(),
        Duration = job.Duration,
        Avatar = job.Avatar
    }).ToList();

    return new Pagination<JobDTO>
    {
        Items = viewJobDtos,
        TotalItems = totalItems,
        PageIndex = pageIndex,
        PageSize = pageSize
    };
}



    private IQueryable<Job> ApplySorting(IQueryable<Job> query, string sortBy, bool isDescending)
    {
        if (typeof(Job).GetProperty(sortBy) == null)
        {
            throw new ArgumentException($"Property '{sortBy}' does not exist on type '{typeof(Job).Name}'");
        }

        var param = Expression.Parameter(typeof(Job), "job");
        var sortExpression = Expression.Property(param, sortBy);
        var orderByExpression = Expression.Lambda<Func<Job, object>>(Expression.Convert(sortExpression, typeof(object)), param);

        return isDescending ? query.OrderByDescending(orderByExpression) : query.OrderBy(orderByExpression);
    }

    public async Task<Pagination<JobDTO>>? GetAllJobsDashboardAsync(JobListRequestDTO filter, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;
        
        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        var users = await _unitOfWork.Repository<User>().FindByConditionAsync(filter: u => u.Id == userId,
            include: u => u.Include(u => u.JobOwner).Include(u => u.Worker));

        var user = users.FirstOrDefault();
        
        Expression<Func<Job, bool>> filterExpression = t =>
            (string.IsNullOrEmpty(filter.Filter) || t.Name.Contains(filter.Filter)
                                                 || t.Description.Contains(filter.Filter))
            && (filter.Status == null || t.Status == filter.Status)
            && ((filter.IsOwner == null && (t.OwnerId == user.JobOwner.Id || t.JobWorkers.Any(jw => jw.WorkerId == user.Worker.Id))) ||
                (filter.IsOwner == true && t.OwnerId == user.JobOwner.Id) ||
                (filter.IsOwner == false && t.JobWorkers.Any(jw => jw.WorkerId == user.Worker.Id)));
        
        
        Func<IQueryable<Job>, IIncludableQueryable<Job, object>> include = query =>
            query.Include(u => u.Owner)
                .Include(u => u.JobWorkers);
        
        
        var listJob = await _unitOfWork.Repository<Job>()
            .GetAllAsync(filterExpression, filter.PageNumber, filter.PageSize, include);
        
        return _mapper.Map<Pagination<JobDTO>>(listJob);
    }

    public async Task<List<JobStatisticalResponseDto>> GetJobStatisticalAsync(JobStatisticalDto filter, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;
        
        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }
        
        var users = await _unitOfWork.Repository<User>().FindByConditionAsync(filter: u => u.Id == userId,
            include: u => u.Include(u => u.JobOwner).Include(u => u.Worker));

        var user = users.FirstOrDefault();
        
        Expression<Func<UserTransaction, bool>> filterExpression = t =>
            t.UserId == userId;
        Expression<Func<Job, bool>> filterEarnExpression = t =>
            t.JobWorkers.Any(jw => jw.WorkerId == user.Worker.Id) && t.Status == JobStatus.COMPLETED;
        
        var listTransaction = await _unitOfWork.Repository<UserTransaction>().GetAllAsync(filterExpression);
        
        var listEarn = await _unitOfWork.Repository<Job>().GetAllAsync(filterEarnExpression);
        var dateRange = Enumerable.Range(0, (filter.To - filter.From).Days + 1)
            .Select(d => filter.From.AddDays(d))
            .ToList();
        
        
        var result = dateRange.Select(date => new JobStatisticalResponseDto
        {
            Date = date,
            Deposit = listTransaction
                .Where(t => t.TransactionDate.Date == date.Date && t.PaymentType == PaymentType.Deposit)
                .Sum(t => t.Amount).ToString(),
            Earn = listEarn
                .Where(t => t.UpdatedAt.Value.Date == date.Date)
                .Sum(t => t.Price).ToString(),
        }).ToList();
        
        return result;
    }


    public async Task<List<JobWorkerDTO>> GetJobWorkersApplyAsync(Guid jobId, string accessToken)
    {
        // Lấy thông tin user ID từ access token
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;
        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        // Tìm kiếm job với jobId và load cả owner và các worker apply vào
        var jobList = await _unitOfWork.Repository<Job>()
            .FindByConditionAsync(j => j.Id == jobId,
                                  include: j => j.Include(j => j.Owner)
                                                 .Include(j => j.JobWorkers)
                                                 .ThenInclude(jw => jw.Worker));
        var job = jobList.FirstOrDefault();

        if (job == null)
        {
            throw new Exception("Job not found.");
        }

        // Kiểm tra quyền của JobOwner bằng cách lấy owner từ userId
        var owner = await _unitOfWork.Repository<JobOwner>().FirstOrDefaultAsync(jo => jo.UserId == userId);
        if (owner == null)
        {
            throw new UnauthorizedAccessException("User is not a job owner.");
        }

        if (job.OwnerId == owner.Id)
        {
            // Nếu user là owner của job, trả về danh sách JobWorkers đã apply
            var jobWorkerDTOs = job.JobWorkers.Select(jw => new JobWorkerDTO
            {
                WorkerId = jw.Worker.Id,
                JobId = jw.JobId,
                ApplyStatus = jw.ApplyStatus.ToString()
            }).ToList();

            return jobWorkerDTOs;
        }
        else
        {
            throw new UnauthorizedAccessException("User does not have permission to view applicants for this job.");
        }
    }



    public async Task<Pagination<JobDTO>> GetJobsCreatedByUserAsync(int pageIndex, int pageSize, string sortBy, bool isDescending, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;
        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        Expression<Func<Job, bool>> filter = job => job.Owner.UserId == userId;

        IQueryable<Job> query = _unitOfWork.Repository<Job>()
            .GetAll(filter)
            .Include(j => j.JobWorkers);

        if (!string.IsNullOrEmpty(sortBy))
        {
            query = ApplySorting(query, sortBy, isDescending);
        }

        var totalItems = await query.CountAsync();
        var paginatedJobs = await query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync();

        var jobDTOs = _mapper.Map<List<JobDTO>>(paginatedJobs);

        return new Pagination<JobDTO>
        {
            Items = jobDTOs,
            TotalItems = totalItems,
            PageIndex = pageIndex,
            PageSize = pageSize
        };
    }


    public async Task<Pagination<JobDTO>> GetJobsAppliedByUserAsync(int pageIndex, int pageSize, string sortBy, bool isDescending, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;
        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        var worker = await _unitOfWork.Repository<Worker>().FirstOrDefaultAsync(w => w.UserId == userId);
        if (worker == null) return new Pagination<JobDTO>();

        var jobWorkers = await _unitOfWork.Repository<JobWorker>()
            .FindByConditionAsync(jw => jw.WorkerId == worker.Id && jw.ApplyStatus == ApplyStatus.Accepted);

        var jobIds = jobWorkers.Select(jw => jw.JobId).ToList();

        Expression<Func<Job, bool>> filter = j => jobIds.Contains(j.Id);

      
        IQueryable<Job> query = _unitOfWork.Repository<Job>()
            .GetAll(filter)
            .Include(j => j.JobWorkers);

        if (!string.IsNullOrEmpty(sortBy))
        {
            query = ApplySorting(query, sortBy, isDescending);
        }

        var totalItems = await query.CountAsync();
        var paginatedJobs = await query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync();

        var jobDTOs = _mapper.Map<List<JobDTO>>(paginatedJobs);

        return new Pagination<JobDTO>
        {
            Items = jobDTOs,
            TotalItems = totalItems,
            PageIndex = pageIndex,
            PageSize = pageSize
        };
    }


    public async Task<List<UserDTO>> GetApplicantsByJobIdAsync(Guid jobId)
    {
        var jobWorkers = await _unitOfWork.Repository<JobWorker>()
            .FindByConditionAsync(jw => jw.JobId == jobId && jw.ApplyStatus == ApplyStatus.Accepted);

        var workerIds = jobWorkers.Select(jw => jw.WorkerId).ToList();

        var workers = await _unitOfWork.Repository<Worker>()
            .FindByConditionAsync(w => workerIds.Contains(w.Id));

        var userIds = workers.Select(w => w.UserId).Distinct().ToList();

        var users = await _unitOfWork.Repository<User>()
            .FindByConditionAsync(u => userIds.Contains(u.Id));

        var userDTOs = _mapper.Map<List<UserDTO>>(users);

        return userDTOs;
    }

    public async Task<JobAndOwnerDetailsResponse?> GetJobAndOwnerDetailsAsync(Guid jobId)
    {
        var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobId);
        if (job == null) return null;

        var jobOwner = await _unitOfWork.Repository<JobOwner>().FirstOrDefaultAsync(jo => jo.Id == job.OwnerId);
        if (jobOwner == null) return null;

        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Id == jobOwner.UserId);
        if (user == null) return null;

        return new JobAndOwnerDetailsResponse
        {
            JobId = job.Id,
            JobName = job.Name,
            Description = job.Description,
            Lat = job.Lat,
            Lon = job.Lon,
            FirstName = user.FirstName,
            Avatar = job.Avatar,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber
        };
    }

    public async Task<JobDTO?> AddJobAsync(CreateJobDto data, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;
        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new Exception("User not found.");
        }

        var jobOwner = await _unitOfWork.Repository<JobOwner>().FirstOrDefaultAsync(jo => jo.UserId == userId);
        if (jobOwner == null)
        {
            jobOwner = new JobOwner
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Rating = 0
            };

            await _unitOfWork.Repository<JobOwner>().AddAsync(jobOwner);
            await _unitOfWork.SaveChangesAsync();
        }

        // Default status set to WAITING_FOR_APPLICANTS
        var newJob = new Job
        {
            Id = Guid.NewGuid(),
            Name = data.Name,
            Description = data.Description,
            OwnerId = jobOwner.Id,
            Address = user.Address,
            Lat = user.Lat,
            Lon = user.Lon,
            Status = JobStatus.WAITING_FOR_APPLICANTS, // Set default status
            Duration = data.Duration ?? Duration.OneHour,
            Price = data.Price,
            Avatar = data.Avatar,
            StartTime = data.StartTime != default ? data.StartTime : DateTime.UtcNow,
            EndTime = data.EndTime,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        await _unitOfWork.Repository<Job>().AddAsync(newJob);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<JobDTO>(newJob);
    }

    public async Task AssignJobAsync(Guid jobId, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken);
        var userIdClaim = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        var role = await GetUserRoleInJobAsync(jobId, accessToken);
        if(role!= null && role == "JobOwner")
        {
            throw new Exception("Job owner cannot assign job.");
        }

        var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobId);
        
        if(job.Status == JobStatus.IN_PROGRESS)
        {
            throw new Exception("Job is already in progress.");
        }
        if(job.Status == JobStatus.DELETED)
        {
            throw new Exception("Job is deleted.");
        }
        if(job.Status == JobStatus.COMPLETED)
        {
            throw new Exception("Job is completed.");
        }
        
        var worker = await _unitOfWork.Repository<Worker>().FirstOrDefaultAsync(w => w.UserId == userId);
        var jobWorker = new JobWorker
        {
            JobId = jobId,
            WorkerId = worker.Id,
            ApplyStatus = ApplyStatus.Pending
        };
        await _unitOfWork.Repository<JobWorker>().AddAsync(jobWorker);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task AcceptWorkerAsync(Guid jobId, Guid workerId, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken);
        var userIdClaim = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }
        
        var role = await GetUserRoleInJobAsync(jobId, accessToken);
        if(role != "JobOwner")
        {
            throw new Exception("Only job owner can accept job.");
        }
        
        var jobWorkerList = await _unitOfWork.Repository<JobWorker>()
            .FindByConditionAsync(jw => jw.JobId == jobId && jw.ApplyStatus == ApplyStatus.Pending);

        var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobWorkerList.First().JobId);

        foreach (var jobWorker in jobWorkerList)
        {
            
            jobWorker.ApplyStatus = ApplyStatus.Rejected;
            
            if(jobWorker.WorkerId == workerId)
            {
                jobWorker.ApplyStatus = ApplyStatus.Accepted;
            }
        }
        job.UpdatedAt = DateTime.Now;
        job.Status = JobStatus.IN_PROGRESS;
        _unitOfWork.Repository<Job>().Update(job);
        _unitOfWork.Repository<JobWorker>().UpdateRange(jobWorkerList);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RejectWorkerAsync(Guid jobId, Guid workerId, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken);
        var userIdClaim = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        var role = await GetUserRoleInJobAsync(jobId, accessToken);
        if (role != "JobOwner")
        {
            throw new Exception("Only job owners can reject job applicants.");
        }

        var jobWorker = await _unitOfWork.Repository<JobWorker>()
            .FindByConditionAsync(jw => jw.JobId == jobId && jw.WorkerId == workerId && jw.ApplyStatus == ApplyStatus.Pending);

        var jobWorkerEntity = jobWorker.FirstOrDefault();
        if (jobWorkerEntity == null)
        {
            throw new Exception("Worker application not found or not in pending status.");
        }

        var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobWorkerEntity.JobId);

        // Update the worker's status to rejected
        jobWorkerEntity.ApplyStatus = ApplyStatus.Rejected;
        job.UpdatedAt = DateTime.Now;

        _unitOfWork.Repository<Job>().Update(job);
        _unitOfWork.Repository<JobWorker>().Update(jobWorkerEntity);
        await _unitOfWork.SaveChangesAsync();
    }

}



