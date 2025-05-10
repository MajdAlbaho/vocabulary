using CoffeeCode.DataBase.Interfaces;
using CoffeeCode.ServiceLayer.Base;
using Vocabulary.Database.Entities;
using Vocabulary.Model;

namespace Vocabulary.ServiceLayer.IServices
{
    public interface IUserAssessmentQuestionService : IBaseService<int, UserAssessmentQuestionModel, UserAssessmentQuestion>, IInjectable
    {
    }
}
