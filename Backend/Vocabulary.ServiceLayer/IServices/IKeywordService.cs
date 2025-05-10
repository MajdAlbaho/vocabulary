using CoffeeCode.DataBase.Interfaces;
using CoffeeCode.ServiceLayer.Base;
using Vocabulary.Database.Entities;
using Vocabulary.Model;

namespace Vocabulary.ServiceLayer.IServices
{
    public interface IKeywordService : IBaseService<int, KeywordModel, Keyword>, IInjectable
    {
    }
}
