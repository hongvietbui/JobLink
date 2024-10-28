using Amazon.S3;
using JobLink_Backend.ChatHub;
using JobLink_Backend.Entities;
using JobLink_Backend.Extensions;
using JobLink_Backend.Mappings;
using JobLink_Backend.Utilities.SignalR.SignalRHubs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Call the custom CORS method to set up CORS policies
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed((host) => true)
                .AllowCredentials();
        });
}); // Ensure you have this line

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<JobLinkContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add custom authentication
builder.Services.AddCustomAuthentication();

// Add custom services
builder.Services.AddCustomServices();
//
builder.Services.AddCustomHttpClients();

builder.Services.AddAWSService<IAmazonS3>();
//Add auto mappers
builder.Services.AddAutoMapper(typeof(MapProfile).Assembly);

var app = builder.Build();
// Apply the CORS policy here
app.UseCors("AllowAll");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/chatHub");
    endpoints.MapHub<NotificationsHub>("/NotificationHub");
});
app.Run();