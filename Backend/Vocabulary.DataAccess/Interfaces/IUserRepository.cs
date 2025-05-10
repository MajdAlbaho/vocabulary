using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using CoffeeCode.DataBase.Interfaces;

namespace Vocabulary.DataAccess.Interfaces
{
    public interface IUserRepository : IInjectable
    {
        Task AddOrUpdateToken(string userId, string tokenHash, IList<Claim> claims);
        Task<string> VerifyUserByTokenHash(string tokenHash);
    }
}
