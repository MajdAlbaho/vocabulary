using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using System.Linq;
using Vocabulary.Api.ApiModel.User;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using Vocabulary.ServiceLayer.IServices;

namespace Vocabulary.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController(IUserService userService) : ControllerBase
    {
        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequestModel userLoginRequestModel) {
            try {
                var tokenResult = await userService.Login(userLoginRequestModel.UserName, userLoginRequestModel.Password);

                Response.Cookies.Append("token", tokenResult.Token, AuthSetup.CookieOptions);
                Response.Cookies.Append("refresh-token", tokenResult.RefreshToken, AuthSetup.CookieOptions);

                return Ok(new {
                    claims = JsonSerializer.Serialize(tokenResult.Claims.Select(e => new { type = e.Type, value = e.Value })),
                    userId = tokenResult.UserId,
                    userName = userLoginRequestModel.UserName
                });
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }


        [HttpPost]
        [Authorize]
        [Route("Logout")]
        public IActionResult Logout() {
            try {
                Response.Cookies.Delete("token", AuthSetup.CookieOptions);
                Response.Cookies.Delete("refresh-token", AuthSetup.CookieOptions);
                return Unauthorized();
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }
    }
}
