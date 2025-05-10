using AutoMapper;
using CoffeeCode.DataBase.Base.Repository;
using CoffeeCode.ServiceLayer.Base;
using Microsoft.AspNetCore.Http;
using Vocabulary.Database.Entities;
using Vocabulary.Model;
using Vocabulary.ServiceLayer.IServices;

namespace Vocabulary.ServiceLayer.Services
{
    internal class UserAssessmentQuestionService : BaseService<int, UserAssessmentQuestionModel, UserAssessmentQuestion>, IUserAssessmentQuestionService
    {
        public UserAssessmentQuestionService(IMapper mapper, IBaseRepository<int, UserAssessmentQuestion> baseRepository, IHttpContextAccessor httpContextAccessor) : base(mapper, baseRepository, httpContextAccessor) {
        }
    }
}
