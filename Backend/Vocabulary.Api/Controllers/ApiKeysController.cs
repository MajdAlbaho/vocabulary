using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using CoffeeCode.Models.DataTables;
using Microsoft.AspNetCore.Authorization;
using Vocabulary.Security;
using Vocabulary.ServiceLayer.IServices;
using Vocabulary.Model;
using Vocabulary.Api.ApiModel.ApiKey;

namespace Vocabulary.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ApiKeysController(IApiKeyService apiKeyService, IApiKeyClaimService apiKeyClaimService) : ControllerBase
    {
        [HttpPost("GetApiKeys")]
        [Authorize(Policy = Policies.ManageApiKeysPolicy)]
        public async Task<IActionResult> GetApiKeys(ApiKeyGetRequestModel requestModel) {
            try {
                var dataTableParamResult = new DataTableParamResult(requestModel.DataTableParam);

                var query = apiKeyService.Get()
                    .Where(e => e.DeletedDate == null && e.IsActive)
                    .AsNoTracking();

                var totalRecord = query.Count();

                if (!string.IsNullOrWhiteSpace(dataTableParamResult.SearchValue)) {
                    query = query.Where(e =>
                        e.DisplayName.Contains(dataTableParamResult.SearchValue)
                    );
                }
                var filteredRecord = query.Count();
                switch (dataTableParamResult.SortColumn) {
                    case 1:
                        query = dataTableParamResult.SortDirection == "asc" ? query.OrderBy(e => e.DisplayName) : query.OrderByDescending(e => e.DisplayName);
                        break;
                    case 2:
                        query = dataTableParamResult.SortDirection == "asc" ? query.OrderBy(e => e.Key) : query.OrderByDescending(e => e.Key);
                        break;
                    default:
                        query = query.OrderBy(e => e.DisplayName);
                        break;
                }

                var apiKeys = await query.Skip(dataTableParamResult.Skip).Take(dataTableParamResult.PageSize)
                    .Select(e => new ApiKeyModel {
                        Id = e.Id,
                        DisplayName = e.DisplayName,
                        ExpirationDate = e.ExpirationDate,
                        IsActive = e.IsActive,
                        Key = e.Key,
                        Domain = e.Domain,
                    }).ToListAsync();

                return Ok(new DataTableResult<List<ApiKeyModel>> {
                    data = apiKeys,
                    recordsFiltered = filteredRecord,
                    recordsTotal = totalRecord
                });
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Policy = Policies.ManageApiKeysPolicy)]
        public async Task<IActionResult> GetById(int id) {
            try {
                var apiKey = await apiKeyService.GetApiKeyWithClaimsById(id);
                if (apiKey == null)
                    return BadRequest(new { message = $"Invalid ApiKey Id {id}" });


                return Ok(apiKey);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(ApiKeyCreateRequestModel requestModel) {
            try {
                if (requestModel == null)
                    return BadRequest(new { message = "Invalid request" });

                var key = Guid.NewGuid().ToString();

                var apiKeyModel = new ApiKeyModel {
                    DisplayName = requestModel.DisplayName,
                    ExpirationDate = requestModel.ExpirationDate,
                    IsActive = true,
                    Key = key,
                    Domain = "",
                    ApiKeyClaims = requestModel.ApiKeyClaims?.Select(e => new ApiKeyClaimModel() {
                        ClaimType = e.ClaimType,
                        ClaimValue = e.ClaimValue,
                    }).ToList()
                };

                await apiKeyService.Add(apiKeyModel);
                return Ok();
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> Put(ApiKeyModifyRequestModel requestModel) {
            try {
                if (requestModel == null)
                    return BadRequest(new { message = "Invalid request" });

                var apiKey = await apiKeyService.GetById(requestModel.Id);
                if (apiKey == null)
                    return BadRequest(new { message = "Invalid ApiKey Id" });

                await apiKeyClaimService.Delete(e => e.ApiKeyId == apiKey.Id);
                await apiKeyClaimService.AddRange(requestModel.ApiKeyClaims.Select(e => new ApiKeyClaimModel() {
                    ApiKeyId = apiKey.Id,
                    ClaimType = e.ClaimType,
                    ClaimValue = e.ClaimValue
                }));

                return Ok(apiKey);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPost]
        [Route("Revoke/{id}")]
        [Authorize(Policy = Policies.RevokeApiKeyPolicy)]
        public async Task<IActionResult> Revoke(int id) {
            try {
                await apiKeyService.Revoke(id);
                return Ok();
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

    }
}
