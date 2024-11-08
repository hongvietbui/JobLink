﻿using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;

namespace JobLink_Backend.Repositories.RepositoryImpls;

public class JobRepositoryImpl : EFRepository<Job>, IJobRepository
{
    private readonly JobLinkContext _context;
    
    public JobRepositoryImpl(JobLinkContext context) : base(context)
    {
        _context = context;
    }
}