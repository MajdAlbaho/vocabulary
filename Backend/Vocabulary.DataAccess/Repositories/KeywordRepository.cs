using CoffeeCode.DataBase.Base.Repository;
using Vocabulary.DataAccess.Interfaces;
using Vocabulary.Database.Entities;

namespace Vocabulary.DataAccess.Repositories
{
    internal class KeywordRepository(VocabularyDbContext context) : BaseRepository<int, Keyword>(context), IKeywordRepository
    {
    }
}
