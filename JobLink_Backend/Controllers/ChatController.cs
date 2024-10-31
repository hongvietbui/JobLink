using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Entities;
using JobLink_Backend.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.ConstrainedExecution;

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

                var worker = _workerService.GetWorkerBySenderIdAsync(senderId);
                var jobOwner = _jobOwnerService.GetJobOwnerBySenderIdAsync(receiverId);

                if (worker != null && jobOwner != null)
                {
                    //Send message to specific user
                     _chatService.SendMessageAsync(senderId, receiverId, chatDTOReq.Message);
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

                var worker = _workerService.GetWorkerBySenderIdAsync(receiverId);
                var jobOwner = _jobOwnerService.GetJobOwnerBySenderIdAsync(senderId);

                if (worker != null && jobOwner != null)
                {
                    //Send message to specific user
                    _chatService.SendMessageAsync(senderId, receiverId, chatDTOReq.Message);
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
