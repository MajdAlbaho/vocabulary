using AutoMapper;
using Vocabulary.Database.Entities;
using Vocabulary.Model;

namespace Vocabulary.ServiceLayer.MappingProfiles
{
    internal class BasicProfile : Profile
    {
        public BasicProfile()
        {
            CreateMap<LanguageModel, Language>().ReverseMap();
            CreateMap<KeywordModel, Keyword>().ReverseMap();
            CreateMap<LanguageKeywordModel, LanguageKeyword>().ReverseMap();
            CreateMap<ApiKeyModel, ApiKey>().ReverseMap();
            CreateMap<ApiKeyClaimModel, ApiKeyClaim>().ReverseMap();
            CreateMap<UserAssessmentModel, UserAssessment>().ReverseMap();
            CreateMap<UserAssessmentQuestionModel, UserAssessmentQuestion>().ReverseMap();
        }
    }
}
