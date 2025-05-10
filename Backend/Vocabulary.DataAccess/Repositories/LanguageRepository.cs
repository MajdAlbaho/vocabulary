using CoffeeCode.DataBase.Base.Repository;
using Vocabulary.DataAccess.Interfaces;
using Vocabulary.Database.Entities;

namespace Vocabulary.DataAccess.Repositories
{
    public class LanguageRepository(VocabularyDbContext context) : BaseRepository<int, Language>(context), ILanguageRepository
    {

    }
}
