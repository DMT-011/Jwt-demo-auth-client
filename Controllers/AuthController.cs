using System.Net;
using System.Text.Json;
using JwtDemo.Authorization;
using JwtDemo.DTOs.Requests;
using JwtDemo.DTOs.Response;
using JwtDemo.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth;
namespace JwtDemo.Controllers;

[JwtDemo.Authorization.Authorize]
public class AuthController : ApiController
{
   private readonly IIdentityService _identityService;
   private readonly HttpClient _httpClient;
   public AuthController(IIdentityService identityService, HttpClient httpClient)
   {
      _identityService = identityService;
      _httpClient = httpClient;
   }


   [AllowAnonymous]
   [HttpPost("register")]
   public async Task<IActionResult> Register(RegisterRequest model)
   {
      try
      {
         await _identityService.RegisterAsync(model);
         return Ok(new { message = "Đăng ký thành công" });
      }
      catch (Exception ex)
      {
         return BadRequest(new { message = ex.Message });
      }
   }
   [AllowAnonymous]
   [HttpPost("login")]
   public async Task<ActionResult<AuthenticationResponse>> Login(LoginRequest model)
   {
      try
      {
         var response = await _identityService.LoginAsync(model, IpAddress());
         return Ok(response);
      }
      catch (Exception ex)
      {
         return BadRequest(new { message = ex.Message });
      }
   }
   [AllowAnonymous]
   [HttpGet("me")]
   public IActionResult GetCurrentUser()
   {
      // Lấy user từ base controller
      return Ok(CurrentUser);
   }
   private string IpAddress()
   {
      if (Request.Headers.ContainsKey("X-Forwarded-For"))
         return Request.Headers["X-Forwarded-For"];
      else
         return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
   }

   [HttpPost("google")]
   public async Task<IActionResult> GoogleLogin([FromBody] CodeRequest request)
   {
      var clientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
      var clientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");
      var redirectUri = "http://localhost:3000/auth/callback/google";

      var tokenRequest = new Dictionary<string, string>
        {
            { "code", request.Code },
            { "client_id", clientId },
            { "client_secret", clientSecret },
            { "redirect_uri", redirectUri },
            { "grant_type", "authorization_code" }
        };

      var response = await _httpClient.PostAsync(
          "https://oauth2.googleapis.com/token",
          new FormUrlEncodedContent(tokenRequest)
      );

      var content = await response.Content.ReadAsStringAsync();
      var tokens = JsonSerializer.Deserialize<GoogleTokenResponse>(content);

      if (tokens == null || tokens.IdToken == null)
         return BadRequest("Không lấy được token từ Google");


      var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(tokens.IdToken);


      var myJwt = "jwt-from-your-system";

      return Ok(new { jwt = myJwt, googleUser = payload });
   }


}