﻿using System.Linq.Expressions;
using System.Security.Claims;
using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request.Jobs;
using JobLink_Backend.DTOs.Response.Jobs;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
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

    public async Task<Role?> GetUserRoleInJobAsync(Guid jobId, string accessToken)
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
        if (job.OwnerId == owner.Id)
        {
            return await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "JobOwner");
        }

        if (job.JobWorkers.Any(jw => jw.WorkerId == worker.Id))
        {
            return await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "Worker");
        }

        return null;
    }

    public async Task<Pagination<JobDTO>>? GetAllJobsDashboardAsync(JobListRequestDTO filter, string accessToken)
    {
        //Todo: Fix GetAllJobsDashboardAsync
        throw new NotImplementedException();
        
        // var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;
        //
        // var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        // if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        // {
        //     throw new Exception("User ID not found in token claims.");
        // }
        //
        //
        // Expression<Func<Job, bool>> filterExpression = t =>
        //     (string.IsNullOrEmpty(filter.Filter) || t.Name.Contains(filter.Filter)
        //                                          || t.Description.Contains(filter.Filter))
        //     && (filter.Status == null || t.Status == filter.Status)
        //     && ((filter.IsOwner == null && (t.OwnerId == userId || t.WorkerId == userId)) ||
        //         (filter.IsOwner == true && t.OwnerId == userId) ||
        //         (filter.IsOwner == false && t.WorkerId == userId));
        //
        //
        // Func<IQueryable<Job>, IIncludableQueryable<Job, object>> include = query =>
        //     query.Include(u => u.Owner)
        //         .Include(u => u.Workers);
        //
        //
        // var listJob = await _unitOfWork.Repository<Job>()
        //     .GetAllAsync(filterExpression, filter.PageNumber, filter.PageSize, include);
        //
        // return _mapper.Map<Pagination<JobDTO>>(listJob);
    }

    public async Task<List<JobStatisticalResponseDto>> GetJobStatisticalAsync(JobStatisticalDto filter, string accessToken)
    {
        //Todo: Fix GetJobStatisticalAsync
        throw new NotImplementedException();
        
        // var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;
        //
        // var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        // if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        // {
        //     throw new Exception("User ID not found in token claims.");
        // }
        //
        // Expression<Func<Transactions, bool>> filterExpression = t =>
        //     t.UserId == userId;
        // Expression<Func<Job, bool>> filterEarnExpression = t =>
        //     t.WorkerId == userId && t.Status == JobStatus.Completed;
        //
        // var listTransaction = await _unitOfWork.Repository<Transactions>().GetAllAsync(filterExpression);
        //
        // var listEarn = await _unitOfWork.Repository<Job>().GetAllAsync(filterEarnExpression);
        // var dateRange = Enumerable.Range(0, (filter.To - filter.From).Days + 1)
        //     .Select(d => filter.From.AddDays(d))
        //     .ToList();
        //
        //
        // var result = dateRange.Select(date => new JobStatisticalResponseDto
        // {
        //     Date = date,
        //     Deposit = listTransaction
        //         .Where(t => t.TransactionDate.Date == date.Date && t.PaymentType == PaymentType.Deposit)
        //         .Sum(t => t.Amount).ToString(),
        //     Earn = listEarn
        //         .Where(t => t.UpdatedAt.Value.Date == date.Date)
        //         .Sum(t => t.Price).ToString(),
        // }).ToList();
        //
        // return result;
    }

    public async Task<List<JobWorker>> GetJobWorkersApplyAsync(Guid jobId, string accessToken)
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
            return job.JobWorkers.ToList();
        }
        else
        {
            throw new UnauthorizedAccessException("User does not have permission to view applicants for this job.");
        }
    }

}