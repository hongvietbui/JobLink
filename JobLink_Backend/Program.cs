using JobLink_Backend.Entities;
using JobLink_Backend.Extensions;
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
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add custom authentication
builder.Services.AddCustomAuthentication();

// Add custom services
builder.Services.AddCustomServices();
//Add auto mappers
builder.Services.AddAutoMapper(typeof(MapProfile).Assembly);

var app = builder.Build();
app.UseCors("AllowAll");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// **Important**: Apply the CORS policy here
 // Ensure you include this line

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
