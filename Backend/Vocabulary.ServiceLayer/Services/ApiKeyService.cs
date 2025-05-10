using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoffeeCode.DataBase.Base.Repository;
using CoffeeCode.ServiceLayer.Base;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Vocabulary.DataAccess.Interfaces;
using Vocabulary.Database.Entities;
using Vocabulary.Model;
using Vocabulary.ServiceLayer.IServices;

namespace Vocabulary.ServiceLayer.Services
{
    public class ApiKeyService(IMapper mapper, IBaseRepository<int, ApiKey> baseRepository, IHttpContextAccessor httpContextAccessor, IApiKeyRepository apiKeyRepository) : BaseService<int, ApiKeyModel, ApiKey>(mapper, baseRepository, httpContextAccessor), IApiKeyService
    {
        private readonly IMapper _mapper = mapper;
        private readonly IBaseRepository<int, ApiKey> _baseRepository = baseRepository;
        private readonly IApiKeyRepository _apiKeyRepository = apiKeyRepository;

        public override async Task<ApiKeyModel> Add(ApiKeyModel modelToAdd) {
            var userName = GetUserIdFromToken();

            var entity = _mapper.Map<ApiKey>(modelToAdd);
            entity.CreatedBy = userName;
            entity.CreatedDate = DateTime.UtcNow;

            foreach (var claim in entity.ApiKeyClaims) {
                claim.CreatedBy = userName;
                claim.CreatedDate = DateTime.UtcNow;
            }

            var item = await _baseRepository.Add(entity);
            return _mapper.Map<ApiKeyModel>(item);
        }


        public async Task<ApiKeyModel> GetApiKeyWithClaimsById(int id) {
            var apiKey = await _baseRepository.Get().AsNoTracking()
                .Include(e => e.ApiKeyClaims
                    .Where(x => x.DeletedDate == null))
                .FirstOrDefaultAsync(e => e.Id == id && e.DeletedDate == null);

            return _mapper.Map<ApiKeyModel>(apiKey);
        }

        public Task Revoke(int id)
        {
            return _apiKeyRepository.Revoke(id);
        }
    }
}
