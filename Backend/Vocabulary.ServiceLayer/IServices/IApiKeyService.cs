using CoffeeCode.DataBase.Interfaces;
using CoffeeCode.ServiceLayer.Base;
using System.Threading.Tasks;
using Vocabulary.Database.Entities;
using Vocabulary.Model;

namespace Vocabulary.ServiceLayer.IServices
{
    public interface IApiKeyService : IBaseService<int, ApiKeyModel, ApiKey>, IInjectable
    {
        Task<ApiKeyModel> GetApiKeyWithClaimsById(int id);
        Task Revoke(int id);
    }
}
