using CoffeeCode.DataBase.Base.Repository;
using CoffeeCode.DataBase.Interfaces;
using Vocabulary.Database.Entities;

namespace Vocabulary.DataAccess.Interfaces
{
    public interface IUserAssessmentQuestionRepository : IBaseRepository<int, UserAssessmentQuestion>, IInjectable
    {
    }
}
