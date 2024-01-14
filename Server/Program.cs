using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Interface;
using Server.Services;

var builder = WebApplication.CreateBuilder(args);


// Add configuration
builder.Configuration.AddJsonFile("appsettings.Development.json", optional: false, reloadOnChange: true);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddSingleton<IDepartmentService, DepartmentService>(provider =>
{
    return new DepartmentService(connectionString);
});

builder.Services.AddSingleton<IEmployeeService, EmployeeService>(provider =>
{
    return new EmployeeService(connectionString);
});

// Swagger/OpenAPI configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseRouting();


app.UseAuthorization();

app.MapControllers();


app.Run();
