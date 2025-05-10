using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Vocabulary.Model;
using Vocabulary.ServiceLayer.IServices;
using Vocabulary.Api.ApiModel.LanguageKeyword;
using System.Security.Claims;
using Vocabulary.Security;

namespace Vocabulary.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class LanguageKeywordsController(ILanguageKeywordService languageKeywordService) : ControllerBase
    {
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll() {
            try {
                var languageKeywords = await languageKeywordService.GetAll();
                return Ok(languageKeywords);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }


        [HttpPost]
        [Authorize(Policy = Policies.ManageKeywordsPolicy)]
        public async Task<IActionResult> Post(LanguageKeywordCreateRequestModel createRequestModel) {
            try {
                if (string.IsNullOrWhiteSpace(createRequestModel.ApplicationUserId)) {
                    createRequestModel.ApplicationUserId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                }

                var languageKeyword = new LanguageKeywordModel {
                    KeywordId = createRequestModel.KeywordId,
                    LanguageId = createRequestModel.LanguageId,
                    DisplayValue = createRequestModel.DisplayValue,
                    ApplicationUserId = createRequestModel.ApplicationUserId
                };

                var createdRecord = await languageKeywordService.Add(languageKeyword);
                return Ok(createdRecord);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPost("PostRange")]
        [Authorize(Policy = Policies.ManageKeywordsPolicy)]
        public async Task<IActionResult> PostRange(List<LanguageKeywordCreateRequestModel> createRequestModels) {
            try {
                var languageModels = new List<LanguageKeywordModel>();
                foreach (var model in createRequestModels) {
                    if (string.IsNullOrWhiteSpace(model.ApplicationUserId)) {
                        model.ApplicationUserId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    }

                    var languageKeyword = new LanguageKeywordModel {
                        KeywordId = model.KeywordId,
                        LanguageId = model.LanguageId,
                        DisplayValue = model.DisplayValue,
                        ApplicationUserId = model.ApplicationUserId
                    };
                    languageModels.Add(languageKeyword);
                }

                var createdRecords = await languageKeywordService.AddRange(languageModels);
                return Ok(createdRecords);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPut]
        [Authorize(Policy = Policies.ManageKeywordsPolicy)]
        public async Task<IActionResult> Put(LanguageKeywordModifyRequestModel modifyRequestModel) {
            try {
                if (string.IsNullOrWhiteSpace(modifyRequestModel.ApplicationUserId)) {
                    modifyRequestModel.ApplicationUserId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                }

                var languageKeyword = new LanguageKeywordModel {
                    Id = modifyRequestModel.Id,
                    KeywordId = modifyRequestModel.KeywordId,
                    LanguageId = modifyRequestModel.LanguageId,
                    DisplayValue = modifyRequestModel.DisplayValue,
                    ApplicationUserId = modifyRequestModel.ApplicationUserId
                };

                await languageKeywordService.Update(languageKeyword);
                return Ok(languageKeyword);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.ManageKeywordsPolicy)]
        public async Task<IActionResult> Post(int id) {
            try {
                await languageKeywordService.Delete(id);
                return Ok();
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }
    }
}
