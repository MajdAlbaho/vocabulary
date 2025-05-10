using CoffeeCode.DataBase.Interfaces;
using CoffeeCode.ServiceLayer.Base;
using Vocabulary.Database.Entities;
using Vocabulary.Model;

namespace Vocabulary.ServiceLayer.IServices
{
    public interface IApiKeyClaimService : IBaseService<int, ApiKeyClaimModel, ApiKeyClaim>, IInjectable
    {
    }
}
