using System.Diagnostics;
using System.Net;
using System.Net.Mail;
using AutoMapper;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Jwt;

namespace JobLink_Backend.Services.ServiceImpls;

public class EmailServiceImpl : IEmailService
{
    public async Task SendEmailAsync(string email, string subject, string body)
    {
        Debug.WriteLine($"Sending email to {email} with subject {subject} and body {body}");
        string fromMail = "linhxautrai0307@gmail.com";
        string fromPassword = "kmindaakspwntkwa";

        MailMessage message = new MailMessage();
        message.From = new MailAddress(fromMail);
        message.Subject = subject;
        message.To.Add(new MailAddress(email));
        message.Body = "<html><body> " + body + " </body></html>";
        message.IsBodyHtml = true;

        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential(fromMail, fromPassword),
            EnableSsl = true,
        };

        smtpClient.Send(message);
        await Task.CompletedTask;
    }
}