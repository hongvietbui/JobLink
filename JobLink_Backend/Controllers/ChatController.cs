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
    public class ChatController(IChatService chatService, IWorkerService workerService,
        IJobOwnerService jobOwnerService, IUserService userService) : BaseController
    {
        private readonly IChatService _chatService = chatService;
        private readonly IWorkerService _workerService = workerService;
        private readonly IJobOwnerService _jobOwnerService = jobOwnerService;
        private readonly IUserService _userService = userService;

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatDTOReq chatDTOReq)
        {
            if (chatDTOReq.IsWorker)
            {
                //Convert string to guid
                var senderId = Guid.Parse(chatDTOReq.SenderId);
                var receiverId = Guid.Parse(chatDTOReq.ReceiverId);

                var worker = await _workerService.GetWorkerBySenderIdAsync(senderId);
                var jobOwner = await _jobOwnerService.GetJobOwnerBySenderIdAsync(receiverId);

                if (worker != null && jobOwner != null)
                {
                    //convert chatDTOReq to json with camelCase
                    var messageJson = JsonConvert.SerializeObject(chatDTOReq, new JsonSerializerSettings
                    {
                        ContractResolver = new CamelCasePropertyNamesContractResolver()
                    });
                    //Send message to specific user
                     await _chatService.SendMessageAsync(worker.UserId, jobOwner.UserId, messageJson);
                    return Ok(new ApiResponse<string> {
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
            else {

                //Convert string to guid
                var senderId = Guid.Parse(chatDTOReq.SenderId);
                var receiverId = Guid.Parse(chatDTOReq.ReceiverId);

                var worker = await _workerService.GetWorkerBySenderIdAsync(receiverId);
                var jobOwner = await _jobOwnerService.GetJobOwnerBySenderIdAsync(senderId);

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
    }
}
