using AutoMapper;
using CoffeeCode.DataBase.Base.Repository;
using CoffeeCode.ServiceLayer.Base;
using Microsoft.AspNetCore.Http;
using Vocabulary.Database.Entities;
using Vocabulary.Model;
using Vocabulary.ServiceLayer.IServices;

namespace Vocabulary.ServiceLayer.Services
{
    public class LanguageService(IMapper mapper, IBaseRepository<int, Language> baseRepository, IHttpContextAccessor httpContextAccessor) : BaseService<int, LanguageModel, Language>(mapper, baseRepository, httpContextAccessor), ILanguageService
    {
    }
}
