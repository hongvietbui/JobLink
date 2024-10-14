using JobLink_Backend.Entities;
using JobLink_Backend.Extensions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Call the custom CORS method to set up CORS policies
builder.Services.AddCustomCors(); // Ensure you have this line

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<JobLinkContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add custom authentication
builder.Services.AddCustomAuthentication();

// Add custom services
builder.Services.AddCustomServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// **Important**: Apply the CORS policy here
app.UseCors("AllowAllOrigins"); // Ensure you include this line

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
