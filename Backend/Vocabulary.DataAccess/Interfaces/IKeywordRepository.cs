using CoffeeCode.DataBase.Base.Repository;
using CoffeeCode.DataBase.Interfaces;
using Vocabulary.Database.Entities;

namespace Vocabulary.DataAccess.Interfaces
{
    public interface IKeywordRepository : IBaseRepository<int, Keyword>, IInjectable
    {
    }
}
