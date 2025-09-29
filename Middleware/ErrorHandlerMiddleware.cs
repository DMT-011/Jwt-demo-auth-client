using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
namespace JwtDemo.Middleware;

public class ErrorHandleMidlware
{
   private readonly RequestDelegate _next;
   private readonly ILogger<ErrorHandleMidlware> _logger;

   public ErrorHandleMidlware(RequestDelegate next, ILogger<ErrorHandleMidlware> logger )
   {
      _next = next;
      _logger = logger;
   }

   public async Task Invoke(HttpContext context)
   {
      try
      {
         await _next(context);
      }
      catch (Exception error)
      {
         // 3. Log the error
         _logger.LogError(error, "An unhandled exception has occurred: { Message} ", error.Message);

         var response = context.Response;
         response.ContentType = "application/json";

         switch (error)
         {
            case KeyNotFoundException:
               response.StatusCode = (int)HttpStatusCode.NotFound;
               break;
            default:
               response.StatusCode = (int)HttpStatusCode.InternalServerError;
               break;
         }

         var result = JsonSerializer.Serialize(new { message = error?.Message });
         await response.WriteAsync(result);
      }
   }
}
