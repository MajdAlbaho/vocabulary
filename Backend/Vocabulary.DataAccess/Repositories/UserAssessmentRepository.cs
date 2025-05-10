using CoffeeCode.DataBase.Base.Repository;
using Microsoft.EntityFrameworkCore;
using Vocabulary.DataAccess.Interfaces;
using Vocabulary.Database.Entities;

namespace Vocabulary.DataAccess.Repositories
{
    public class UserAssessmentRepository : BaseRepository<int, UserAssessmentQuestion>, IUserAssessmentQuestionRepository
    {
        public UserAssessmentRepository(DbContext context) : base(context) { }
    }
}
