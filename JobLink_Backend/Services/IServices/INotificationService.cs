using Microsoft.AspNetCore.Components.Web;

namespace JobLink_Backend.Services.IServices;

public interface INotificationService
{
    Task sendNotificationAsync(string title, string message, string timestamp);
    Task sendNotificationToUserAsync(Guid userId, string title, string message, string timestamp);
}