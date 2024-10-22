using System.Linq.Expressions;
﻿using System.Security.Claims;
using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities;
using JobLink_Backend.Utilities.Jwt;
using JobLink_Backend.Utilities.Pagination;
using Microsoft.EntityFrameworkCore;

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
        
        var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobId);
        
        if (job == null)
        {
            throw new Exception("Job not found.");
        }
        
        if (job.OwnerId == userId)
        {
            return await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "JobOwner");
        }
        
        if (job.WorkerId == userId)
        {
            return await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "Worker");
        }
        
        return null;
    }

    public async Task<Pagination<JobDTO>> GetJobsAsync(int pageIndex, int pageSize, string sortBy, bool isDescending, Expression<Func<Job, bool>> filter = null)
    {
        var jobRepository = _unitOfWork.Repository<Job>();
        var userRepository = _unitOfWork.Repository<User>();


        if (filter == null)
        {
            filter = job => true; 
        }

        IQueryable<Job> query = jobRepository.GetAll(filter);

        if (!string.IsNullOrEmpty(sortBy))
        {
            query = ApplySorting(query, sortBy, isDescending);
        }

        var totalItems = await jobRepository.CountAsync(filter);

        var paginatedJobs = await query.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync();

        // Map to ViewJob DTOs
        var viewJobDtos = await Task.WhenAll(paginatedJobs.Select(async job =>
        {
            var owner = await userRepository.GetByIdAsync(job.OwnerId);
            return new JobDTO
            {
                Id = job.Id,
                Name = job.Name,
                Description = job.Description,
                OwnerId = job.OwnerId,
                WorkerId = job.WorkerId,
                Address = job.Address,
                Lat = job.Lat,
                Lon = job.Lon,
                Status = job.Status.GetStringValue(),
            };
        }));

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
      
        var param = Expression.Parameter(typeof(Job), "job");
        var sortExpression = Expression.Property(param, sortBy);
        var orderByExpression = Expression.Lambda<Func<Job, object>>(Expression.Convert(sortExpression, typeof(object)), param);

        return isDescending ? query.OrderByDescending(orderByExpression) : query.OrderBy(orderByExpression);
    }

}
