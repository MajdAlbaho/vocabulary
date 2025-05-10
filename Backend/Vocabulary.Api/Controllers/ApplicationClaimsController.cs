using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Authorization;
using Vocabulary.Security;

namespace Vocabulary.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ApplicationClaimsController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() {
            try {
                var claims = Claims.GetAll();
                return Ok(claims);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }
    }
}
