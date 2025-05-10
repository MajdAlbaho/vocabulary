using CoffeeCode.DataBase.Base.Repository;
using CoffeeCode.DataBase.Interfaces;
using Vocabulary.Database.Entities;

namespace Vocabulary.DataAccess.Interfaces
{
    internal interface IApiKeyClaimRepository : IBaseRepository<int, ApiKeyClaim>, IInjectable
    {
    }
}
