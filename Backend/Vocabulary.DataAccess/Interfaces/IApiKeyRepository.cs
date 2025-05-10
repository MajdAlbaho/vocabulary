using System.Threading.Tasks;
using CoffeeCode.DataBase.Base.Repository;
using CoffeeCode.DataBase.Interfaces;
using Vocabulary.Database.Entities;

namespace Vocabulary.DataAccess.Interfaces
{
    public interface IApiKeyRepository : IBaseRepository<int, ApiKey>, IInjectable
    {
        Task Revoke(int id);
    }
}
