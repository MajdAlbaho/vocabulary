using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Vocabulary.Model;
using Vocabulary.ServiceLayer.IServices;
using Vocabulary.Api.ApiModel.Language;
using Vocabulary.Security;

namespace Vocabulary.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class LanguagesController(ILanguageService languageService) : ControllerBase
    {
        [HttpGet("GetAll")]
        [Authorize(Policy = Policies.ManageLanguagesPolicy)]
        public async Task<IActionResult> GetAll() {
            try {
                var languages = await languageService.GetAll();
                return Ok(languages);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPost]
        [Authorize(Policy = Policies.ManageLanguagesPolicy)]
        public async Task<IActionResult> Post(LanguageCreateRequestModel createRequestModel) {
            try {
                var language = new LanguageModel {
                    DisplayName = createRequestModel.DisplayName,
                    Code = createRequestModel.Code,
                };

                var createdRecord = await languageService.Add(language);
                return Ok(createdRecord);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPut]
        [Authorize(Policy = Policies.ManageLanguagesPolicy)]
        public async Task<IActionResult> Put(LanguageModifyRequestModel modifyRequestModel) {
            try {
                var languageKeyword = new LanguageModel {
                    Id = modifyRequestModel.Id,
                    DisplayName = modifyRequestModel.DisplayName,
                    Code = modifyRequestModel.Code,
                };

                await languageService.Update(languageKeyword);
                return Ok(languageKeyword);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.ManageLanguagesPolicy)]
        public async Task<IActionResult> Post(int id) {
            try {
                await languageService.Delete(id);
                return Ok();
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }
    }
}
