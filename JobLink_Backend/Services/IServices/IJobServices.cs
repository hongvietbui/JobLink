﻿using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;
using JobLink_Backend.Utilities.Pagination;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace JobLink_Backend.Services.IServices
{
    public interface IJobServices
    {
        Task<Pagination<JobDTO>> GetJobsAsync(int pageIndex, int pageSize, string sortBy, bool isDescending, Expression<Func<Job, bool>> filter = null);
    }
}
