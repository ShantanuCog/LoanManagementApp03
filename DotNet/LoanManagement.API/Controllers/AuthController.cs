using LoanManagement.API.Models;
using LoanManagement.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LoanManagement.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<AuthResponse>.ErrorResponse("Invalid request data"));
            }

            var response = await _authService.RegisterAsync(request);

            if (response == null)
            {
                return BadRequest(ApiResponse<AuthResponse>.ErrorResponse("Email already exists"));
            }

            return Ok(ApiResponse<AuthResponse>.SuccessResponse(response, "User registered successfully"));
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<AuthResponse>.ErrorResponse("Invalid request data"));
            }

            var response = await _authService.LoginAsync(request);

            if (response == null)
            {
                return Unauthorized(ApiResponse<AuthResponse>.ErrorResponse("Invalid email or password"));
            }

            return Ok(ApiResponse<AuthResponse>.SuccessResponse(response, "Login successful"));
        }
    }
}
