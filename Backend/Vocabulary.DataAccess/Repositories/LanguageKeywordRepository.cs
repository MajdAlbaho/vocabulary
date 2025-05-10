using System.Collections.Generic;
using System.Threading.Tasks;
using CoffeeCode.DataBase.Base.Repository;
using Vocabulary.DataAccess.Interfaces;
using Vocabulary.Database.Entities;

namespace Vocabulary.DataAccess.Repositories
{
    public class LanguageKeywordRepository(VocabularyDbContext context) : BaseRepository<int, LanguageKeyword>(context), ILanguageKeywordRepository
    {
        public override Task<List<LanguageKeyword>> GetAll()
        {
            return base.GetAll();
        }
    }
}
