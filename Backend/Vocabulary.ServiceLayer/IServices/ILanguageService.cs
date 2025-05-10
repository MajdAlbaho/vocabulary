using CoffeeCode.DataBase.Interfaces;
using CoffeeCode.ServiceLayer.Base;
using Vocabulary.Database.Entities;
using Vocabulary.Model;

namespace Vocabulary.ServiceLayer.IServices
{
    public interface ILanguageService : IBaseService<int, LanguageModel, Language>, IInjectable
    {
    }
}
