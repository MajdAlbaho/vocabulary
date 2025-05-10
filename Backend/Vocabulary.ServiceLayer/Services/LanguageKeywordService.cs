using System.Collections.Generic;
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
    public class LanguageKeywordService(IMapper mapper, IBaseRepository<int, LanguageKeyword> baseRepository, IHttpContextAccessor httpContextAccessor) : BaseService<int, LanguageKeywordModel, LanguageKeyword>(mapper, baseRepository, httpContextAccessor), ILanguageKeywordService
    {
        public override async Task<List<LanguageKeywordModel>> GetAll() {
            var languageKeywords = await baseRepository.Get().AsNoTracking()
                .Include(e => e.Language)
                .Include(e => e.Keyword)
                .ToListAsync();

            return mapper.Map<List<LanguageKeywordModel>>(languageKeywords);
        }
    }
}
