using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Entities;
using JobLink_Backend.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.ConstrainedExecution;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace JobLink_Backend.Controllers
{
    public class ChatController(
        IChatService chatService,
        IWorkerService workerService,
        IJobOwnerService jobOwnerService,
        IUserService userService,
        IJobService jobService,
        IConversationService conversationService) : BaseController
    {
        private readonly IChatService _chatService = chatService;
        private readonly IWorkerService _workerService = workerService;
        private readonly IJobOwnerService _jobOwnerService = jobOwnerService;
        private readonly IUserService _userService = userService;
        private readonly IJobService _jobService = jobService;
        private readonly IConversationService _conversationService = conversationService;

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatDTOReq chatDTOReq)
        {
            if (chatDTOReq.IsWorker)
            {
                //Convert string to guid
                var senderId = Guid.Parse(chatDTOReq.SenderId);
                var receiverId = Guid.Parse(chatDTOReq.ReceiverId);

                var worker = await _workerService.GetWorkerByIdAsync(senderId);
                var jobOwner = await _jobOwnerService.GetJobOwnerByIdAsync(receiverId);

                if (worker != null && jobOwner != null)
                {
                    //convert chatDTOReq to json with camelCase
                    var messageJson = JsonConvert.SerializeObject(chatDTOReq, new JsonSerializerSettings
                    {
                        ContractResolver = new CamelCasePropertyNamesContractResolver()
                    });
                    //Send message to specific user
                    await _chatService.SendMessageAsync(worker.UserId, jobOwner.UserId, messageJson);
                    return Ok(new ApiResponse<string>
                    {
                        Data = "sent successfully",
                        Timestamp = DateTime.Now.Ticks
                    });
                }
                else
                {
                    return BadRequest(new ApiResponse<string>
                    {
                        Data = "cannot find worker or job owner",
                        Timestamp = DateTime.Now.Ticks
                    });
                }
            }
            else
            {
                //Convert string to guid
                var senderId = Guid.Parse(chatDTOReq.SenderId);
                var receiverId = Guid.Parse(chatDTOReq.ReceiverId);

                var worker = await _workerService.GetWorkerByIdAsync(receiverId);
                var jobOwner = await _jobOwnerService.GetJobOwnerByIdAsync(senderId);

                if (worker != null && jobOwner != null)
                {
                    //convert chatDTOReq to json with camelCase
                    var messageJson = JsonConvert.SerializeObject(chatDTOReq, new JsonSerializerSettings
                    {
                        ContractResolver = new CamelCasePropertyNamesContractResolver()
                    });

                    //Send message to specific user
                    await _chatService.SendMessageAsync(jobOwner.UserId, worker.UserId, messageJson);
                    return Ok(new ApiResponse<string>
                    {
                        Data = "sent successfully",
                        Timestamp = DateTime.Now.Ticks
                    });
                }
                else
                {
                    return BadRequest(new ApiResponse<string>
                    {
                        Data = "cannot find worker or job owner",
                        Timestamp = DateTime.Now.Ticks
                    });
                }
            }
        }

        [HttpGet("getOrCreate/{jobId}/{workerId}")]
        public async Task<IActionResult> GetOrCreateConversation(Guid jobId, Guid workerId)
        {
            // var jobOwner = _context.Jobs.FirstOrDefault(j => j.Id == jobId)?.OwnerId;

            var jobOwner = await _jobOwnerService.GetJobOwnerByJobIdAsync(jobId);
            if (jobOwner == null) return NotFound("Job owner not found.");

            var conversation = await _conversationService.GetConversationByJobIdAndWorkerAsync(jobId, workerId);
            // var conversation = await _context.Conversations
            //     .FirstOrDefaultAsync(c => c.JobId == jobId && c.WorkerId == workerId);

            if (conversation == null)
            {
                conversation = await _conversationService.CreateNewConversationAsync(jobId, workerId);
            }

            return Ok(new ApiResponse<Conversation>
            {
                Data = conversation,
                Timestamp = DateTime.Now.Ticks
            });
        }
        
        
        [HttpGet("{conversationId}")]
        public async Task<IActionResult> GetAllConversation(Guid conversationId)
        {
            var conversation = await _conversationService.GetAllMessagesByConversationIdAsync(conversationId);
            // var user = await _conversationService.
            if (conversation == null)
            {
                return NotFound("Conversation not found.");
            }

            return Ok(new ApiResponse<List<Message>>
            {
                Data = conversation,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }
}