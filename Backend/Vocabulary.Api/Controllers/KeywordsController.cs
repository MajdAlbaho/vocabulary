using Microsoft.AspNetCore.Mvc;
using RestSharp;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Vocabulary.Api.ApiModel;
using Microsoft.Extensions.Configuration;
using Vocabulary.Api.ApiModel.Keyword;
using Vocabulary.Model;
using Vocabulary.ServiceLayer.IServices;
using CoffeeCode.Models.DataTables;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Vocabulary.Security;

namespace Vocabulary.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class KeywordsController(IConfiguration configuration, IKeywordService keywordService) : ControllerBase
    {
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll() {
            try {
                var keywords = await keywordService.GetAll();
                return Ok(keywords);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Policy = Policies.ManageKeywordsPolicy)]
        public async Task<IActionResult> GetById(int id) {
            try {
                var keyword = await keywordService.GetById(id);
                return Ok(keyword);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPost("GetKeywords")]
        [Authorize(Policy = Policies.ManageKeywordsPolicy)]
        public async Task<IActionResult> GetKeywords(KeywordGetRequestModel requestModel) {
            try {
                var dataTableParamResult = new DataTableParamResult(requestModel.DataTableParam);

                var query = keywordService.Get().AsNoTracking()
                    .Where(e => e.DeletedDate == null);

                var totalRecord = query.Count();

                if (!string.IsNullOrWhiteSpace(dataTableParamResult.SearchValue)) {
                    query = query.Where(e =>
                        e.Code.Contains(dataTableParamResult.SearchValue) ||
                        e.DisplayName.Contains(dataTableParamResult.SearchValue)
                    );
                }
                var filteredRecord = query.Count();
                switch (dataTableParamResult.SortColumn) {
                    case 0:
                        query = dataTableParamResult.SortDirection == "asc" ? query.OrderBy(e => e.Code) : query.OrderByDescending(e => e.Code);
                        break;
                    case 1:
                        query = dataTableParamResult.SortDirection == "asc" ? query.OrderBy(e => e.DisplayName) : query.OrderByDescending(e => e.DisplayName);
                        break;
                    default:
                        query = query.OrderBy(e => e.DisplayName);
                        break;
                }

                var keywords = await query.Skip(dataTableParamResult.Skip).Take(dataTableParamResult.PageSize)
                    .Select(e => new KeywordModel {
                        Id = e.Id,
                        Code = e.Code,
                        DisplayName = e.DisplayName
                    }).ToListAsync();

                return Ok(new DataTableResult<List<KeywordModel>> {
                    data = keywords,
                    recordsFiltered = filteredRecord,
                    recordsTotal = totalRecord
                });
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }


        [HttpPost]
        [Authorize(Policy = Policies.ManageKeywordsPolicy)]
        public async Task<IActionResult> Post(KeywordCreateRequestModel createRequestModel) {
            try {
                var keyword = new KeywordModel {
                    Code = createRequestModel.Code,
                    DisplayName = createRequestModel.DisplayName,
                    LanguageKeywords = createRequestModel.LanguageKeywords?.Select(e => new LanguageKeywordModel {
                        LanguageId = e.LanguageId,
                        DisplayValue = e.DisplayValue,
                        Note = e.Note
                    }).ToList()
                };

                var createdRecord = await keywordService.Add(keyword);
                return Ok(createdRecord);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPut]
        [Authorize(Policy = Policies.ManageKeywordsPolicy)]
        public async Task<IActionResult> Put(KeywordModifyRequestModel modifyRequestModel) {
            try {
                var keyword = new KeywordModel {
                    Id = modifyRequestModel.Id,
                    Code = modifyRequestModel.Code,
                    DisplayName = modifyRequestModel.DisplayName,
                    LanguageKeywords = modifyRequestModel.LanguageKeywords?.Select(e => new LanguageKeywordModel {
                        LanguageId = e.LanguageId,
                        DisplayValue = e.DisplayValue,
                        Note = e.Note
                    }).ToList()
                };

                await keywordService.Update(keyword);
                return Ok(keyword);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpDelete("{keywordId}")]
        [Authorize(Policy = Policies.ManageKeywordsPolicy)]
        public async Task<IActionResult> Put(int keywordId) {
            try {
                await keywordService.Delete(keywordId);
                return Ok();
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpGet("GetExample/{word}")]
        [Authorize(Policy = Policies.ManageKeywordsPolicy)]
        public async Task<IActionResult> GetExample(string word) {
            try {
                var apiUrl =
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
                var client = new RestClient(apiUrl);

                // Create a POST request
                var request = new RestRequest("?key=AIzaSyBZtMIiqE3Fg3GB-bAM6tnoLYh0bojTi-g", Method.Post);
                var requestBody = new {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = $"Use ({word}) in sentence" }
                            }
                        }
                    }
                };
                request.AddJsonBody(requestBody);
                var response = await client.ExecuteAsync(request);

                // Check if the response is successful
                if (response.IsSuccessful == false)
                    return BadRequest(new { message = $"Status Code : {response.StatusCode} - {response.Content}" });

                if (string.IsNullOrWhiteSpace(response.Content))
                    return BadRequest(new { message = $"Response content has no data!!" });

                using var doc = JsonDocument.Parse(response.Content);
                var text = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                if (string.IsNullOrWhiteSpace(text))
                    return BadRequest(new { message = $"Result not found!!" });

                return Ok(text.TrimEnd());
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }


        [HttpPost("Translate")]
        [Authorize(Policy = Policies.ManageKeywordsPolicy)]
        public async Task<IActionResult> TranslateTo(TranslateRequestModel translateRequest) {
            try {
                var apiUrl =
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
                var client = new RestClient(apiUrl);

                // Create a POST request
                var request = new RestRequest(configuration["Google:ApiKey"], Method.Post);
                var requestBody = new {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = $"Translate ({translateRequest.Sentence} to ({translateRequest.TargetLanguage}) without interpretation and only one sentence" }
                            }
                        }
                    }
                };
                request.AddJsonBody(requestBody);
                var response = await client.ExecuteAsync(request);

                // Check if the response is successful
                if (response.IsSuccessful == false)
                    return BadRequest(new { message = $"Status Code : {response.StatusCode} - {response.Content}" });

                if (string.IsNullOrWhiteSpace(response.Content))
                    return BadRequest(new { message = $"Response content has no data!!" });

                using var doc = JsonDocument.Parse(response.Content);
                var text = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                if (string.IsNullOrWhiteSpace(text))
                    return BadRequest(new { message = $"Result not found!!" });

                return Ok(text.TrimEnd());
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }


    }
}
