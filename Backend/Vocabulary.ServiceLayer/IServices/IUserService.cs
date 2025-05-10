using System.Threading.Tasks;
using CoffeeCode.DataBase.Interfaces;
using Vocabulary.Model.Base;

namespace Vocabulary.ServiceLayer.IServices
{
    public interface IUserService : IInjectable
    {
        Task<TokenResultModel> Login(string userName, string password);
        Task<TokenResultModel> RefreshToken(string token, string refreshToken);
    }
}
