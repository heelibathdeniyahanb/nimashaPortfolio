using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;
using System.Collections.Generic;
using System.Threading.Tasks;
using Portfolio.Models;
using Portfolio.Data;

namespace Portfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly SmtpSettings _smtpSettings;
        private readonly DatabaseContext _context;

        public EmailController(IConfiguration configuration, DatabaseContext context)
        {
            _smtpSettings = configuration.GetSection("Smtp").Get<SmtpSettings>();
            _context = context;
        }

        [HttpPost]
        [Route("SendContactFormEmail")]
        public async Task<IActionResult> SendContactFormEmail([FromBody] ContactFormModel model)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_smtpSettings.From));
            email.To.Add(MailboxAddress.Parse(_smtpSettings.From)); // Send to your own email
            email.Subject = "New Contact Form Submission";

            var builder = new BodyBuilder
            {
                HtmlBody = $@"
                    <p>Name: {model.Name}</p>
                    <p>Email: {model.Email}</p>
                    <p>Mobile No : {model.MobileNo}</p>
                    <p>Message: {model.Message}</p>"
            };
            email.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_smtpSettings.Host, _smtpSettings.Port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_smtpSettings.Username, _smtpSettings.Password);
            await client.SendAsync(email);
            await client.DisconnectAsync(true);

            var emailModel = new Email
            {
                From = _smtpSettings.From,
                To = _smtpSettings.From,
                Subject = email.Subject,
                Body = builder.HtmlBody,
                SentDateTime = DateTime.Now
            };

            _context.Emails.Add(emailModel);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Email sent successfully" });
        }
    }

    public class ContactFormModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string MobileNo { get; set; }
        public string Message { get; set; }
    }

    public class SmtpSettings
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string From { get; set; }
    }
}
