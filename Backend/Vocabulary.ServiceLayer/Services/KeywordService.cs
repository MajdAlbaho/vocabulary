using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoffeeCode.DataBase.Base.Repository;
using CoffeeCode.ServiceLayer.Base;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Vocabulary.Database.Entities;
using Vocabulary.Model;
using Vocabulary.ServiceLayer.IServices;

namespace Vocabulary.ServiceLayer.Services
{
    public class KeywordService(IMapper mapper, IBaseRepository<int, Keyword> baseRepository, IBaseRepository<int, LanguageKeyword> languageKeywordRepository, IHttpContextAccessor httpContextAccessor) : BaseService<int, KeywordModel, Keyword>(mapper, baseRepository, httpContextAccessor), IKeywordService
    {
        public override async Task<KeywordModel> GetById(int id) {
            var keyword = await baseRepository.Get().AsNoTracking()
                .Include(e => e.LanguageKeywords.Where(e => e.DeletedDate == null))
                .FirstOrDefaultAsync(e => e.Id == id);

            return mapper.Map<KeywordModel>(keyword);
        }

        public override Task<KeywordModel> Add(KeywordModel modelToAdd) {
            var entity = mapper.Map<Keyword>(modelToAdd);
            var userId = GetUserIdFromToken();
            entity.CreatedBy = userId;
            entity.CreatedDate = DateTime.UtcNow;

            foreach (var languageKeyword in entity.LanguageKeywords) {
                languageKeyword.CreatedBy = userId;
                languageKeyword.CreatedDate = DateTime.UtcNow;
                languageKeyword.ApplicationUserId = userId;
            }

            return base.Add(modelToAdd);
        }

        public override async Task Update(KeywordModel modelToUpdate) {
            var entity = mapper.Map<Keyword>(modelToUpdate);
            var userId = GetUserIdFromToken();
            entity.ModifiedBy = userId;
            entity.LastModifiedDate = DateTime.UtcNow;

            foreach (var languageKeyword in entity.LanguageKeywords) {
                languageKeyword.ModifiedBy = userId;
                languageKeyword.LastModifiedDate = DateTime.UtcNow;
            }

            await languageKeywordRepository.Delete(userId, e => e.KeywordId == entity.Id);
            await base.Update(modelToUpdate);
        }
    }
}
