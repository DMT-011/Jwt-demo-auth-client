using JwtDemo.Authorization;
using JwtDemo.Data;
using JwtDemo.Services;
using JwtDemo.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using JwtDemo.Middleware;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();
// 1. Cấu hình services
{
    var services = builder.Services;
    var configuration = builder.Configuration;

    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

    services.AddCors();
    services.AddControllers();

    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen();

    // Đăng ký các service tự viết
    services.AddScoped<IIdentityService, IdentityService>();
    services.AddScoped<IJwtUtils, JwtUtils>();
    services.AddScoped<JwtDemo.Repositories.Interfaces.IUserRepository, JwtDemo.Repositories.UserRepository>();
}

var app = builder.Build();



app.UseMiddleware<JwtDemo.Middleware.ErrorHandleMidlware>();
// 2. Seed data
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        // Apply pending migrations
        context.Database.Migrate();
        // Seed data
        DataSeeder.Seed(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding or migrating the database.");
    }
}

// 3. Cấu hình HTTP request pipeline
{
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseCors(x => x
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

    // Middleware tùy chỉnh để xác thực JWT
    app.UseMiddleware<JwtMiddleware>();

    app.MapControllers();
}

app.Run();