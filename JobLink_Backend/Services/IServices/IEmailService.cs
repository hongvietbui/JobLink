namespace JobLink_Backend.Services.IServices;

public interface IEmailService
{
    Task SendEmailAsync(string email, string subject, string body);
}