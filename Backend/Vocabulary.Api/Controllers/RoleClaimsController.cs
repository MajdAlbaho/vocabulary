using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Vocabulary.Model.Base;
using Microsoft.EntityFrameworkCore;
using Vocabulary.Api.ApiModel.Role.RoleClaim;
using Vocabulary.Security;

namespace Vocabulary.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class RoleClaimsController(RoleManager<IdentityRole> roleManager) : ControllerBase
    {
        [HttpGet]
        [Route("GetByRoleName/{roleName}")]
        [Authorize(Policy = Policies.ManageRolesPolicy)]
        public async Task<IActionResult> GetByUserId(string roleName) {
            try {
                var role = await roleManager.Roles.FirstOrDefaultAsync(e => e.Name == roleName);
                if (role == null)
                    return BadRequest();

                var claims = (await roleManager.GetClaimsAsync(role)).
                    Select(e => new ClaimModel(e.Type, e.Value));
                return Ok(claims);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPut("{roleName}")]
        [Authorize(Policy = Policies.ManageRolesPolicy)]
        public async Task<IActionResult> Put(string roleName, List<RoleClaimModifyRequestModel> requestModel) {
            try {
                if (string.IsNullOrWhiteSpace(roleName))
                    return BadRequest("Invalid RoleName submitted");

                var role = await roleManager.FindByNameAsync(roleName);
                if (role == null)
                    return BadRequest();

                var errors = new List<string>();
                var existingClaims = await roleManager.GetClaimsAsync(role);
                foreach (var existClaim in existingClaims) {
                    var result = await roleManager.RemoveClaimAsync(role, existClaim);
                    if (!result.Succeeded) {
                        errors.AddRange(result.Errors.Select(e => e.Description).ToList());
                    }
                }

                var newClaims = requestModel.Select(e => new Claim(e.ClaimType, e.ClaimValue));
                foreach (var claim in newClaims) {
                    var result = await roleManager.AddClaimAsync(role, claim);
                    if (!result.Succeeded) {
                        errors.AddRange(result.Errors.Select(e => e.Description).ToList());
                    }
                }

                if (errors.Any()) {
                    return BadRequest(new { message = string.Join(Environment.NewLine, errors) });
                }

                return Ok();
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpDelete]
        [Route("{roleName}")]
        [Authorize(Policy = Policies.ManageRolesPolicy)]
        public async Task<IActionResult> Delete(string roleName) {
            try {
                var role = await roleManager.FindByNameAsync(roleName);
                if (role == null)
                    return BadRequest();

                var existingClaims = await roleManager.GetClaimsAsync(role);
                foreach (var existingClaim in existingClaims) {
                    await roleManager.RemoveClaimAsync(role, existingClaim);
                }

                return Ok();
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }
    }
}
