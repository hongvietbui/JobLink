using Amazon.S3;
using JobLink_Backend.Entities;
using JobLink_Backend.Extensions;
using JobLink_Backend.Hubs;
using JobLink_Backend.Mappings;
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
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), sqlOptions =>
    {
        sqlOptions.CommandTimeout(60);
        sqlOptions.EnableRetryOnFailure();
    }));

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

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirect HTTP to HTTPS
app.UseHttpsRedirection();

// config Routing
app.UseRouting();
// Cors
app.UseCors("AllowAll");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization(); 

// Config endpoints
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/hub/chat");
    endpoints.MapHub<TransferHub>("/hub/transfer");
    endpoints.MapControllers(); // Đảm bảo điều này nằm trong UseEndpoints
    //endpoints.MapHub<NotificationHub>("/NotificationHub");
});

app.Run();