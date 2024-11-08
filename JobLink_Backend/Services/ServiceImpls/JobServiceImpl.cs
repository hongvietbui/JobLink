@ -217,7 + 217,7 @@ public class JobServiceImpl(IUnitOfWork unitOfWork, IMapper mapper, JwtService j
            throw new Exception("User ID not found in token claims.");
        }

        Expression<Func<Job, bool>> filter = job => job.Owner.UserId == userId && job.Status == JobStatus.WAITING_FOR_APPLICANTS;
Expression<Func<Job, bool>> filter = job => job.Owner.UserId == userId && (job.Status == JobStatus.WAITING_FOR_APPLICANTS || job.Status == JobStatus.IN_PROGRESS);


IQueryable<Job> query = _unitOfWork.Repository<Job>()
@ -291,8 +291,16 @@ public class JobServiceImpl(IUnitOfWork unitOfWork, IMapper mapper, JwtService j

    public async Task<List<UserWithWorkerIdDTO>> GetApplicantsByJobIdAsync(Guid jobId)
{
    var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobId);
    if (job == null)
    {
        throw new Exception("Job not found.");
    }

    ApplyStatus desiredStatus = job.Status == JobStatus.WAITING_FOR_APPLICANTS ? ApplyStatus.Pending : ApplyStatus.Accepted;

    var jobWorkers = await _unitOfWork.Repository<JobWorker>()
  .FindByConditionAsync(jw => jw.JobId == jobId && jw.ApplyStatus == ApplyStatus.Pending);
            .FindByConditionAsync(jw => jw.JobId == jobId && jw.ApplyStatus == desiredStatus);

    var workerIds = jobWorkers.Select(jw => jw.WorkerId).ToList();

@ -320,6 + 328,7 @@ public class JobServiceImpl(IUnitOfWork unitOfWork, IMapper mapper, JwtService j
        return result;
    }


    public async Task<JobAndOwnerDetailsResponse?> GetJobAndOwnerDetailsAsync(Guid jobId)
{
    var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobId);
