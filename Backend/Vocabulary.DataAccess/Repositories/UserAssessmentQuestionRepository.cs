using CoffeeCode.DataBase.Base.Repository;
using Microsoft.EntityFrameworkCore;
using Vocabulary.DataAccess.Interfaces;
using Vocabulary.Database.Entities;

namespace Vocabulary.DataAccess.Repositories
{
    public class UserAssessmentQuestionRepository : BaseRepository<int, UserAssessmentQuestion>, IUserAssessmentQuestionRepository
    {
        public UserAssessmentQuestionRepository(DbContext context) : base(context) {
        }
    }
}
