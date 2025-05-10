using AutoMapper;
using CoffeeCode.DataBase.Base.Repository;
using CoffeeCode.ServiceLayer.Base;
using Microsoft.AspNetCore.Http;
using Vocabulary.Database.Entities;
using Vocabulary.Model;
using Vocabulary.ServiceLayer.IServices;

namespace Vocabulary.ServiceLayer.Services
{
    internal class ApiKeyClaimService(IMapper mapper, IBaseRepository<int, ApiKeyClaim> baseRepository, IHttpContextAccessor httpContextAccessor) : BaseService<int, ApiKeyClaimModel, ApiKeyClaim>(mapper, baseRepository, httpContextAccessor), IApiKeyClaimService;
}
