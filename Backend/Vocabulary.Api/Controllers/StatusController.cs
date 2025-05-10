using Microsoft.AspNetCore.Mvc;
using System;

namespace Vocabulary.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() {
            try {
                return Ok("API is running...");
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }
    }
}
