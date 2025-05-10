using System.Collections.Generic;

namespace Vocabulary.Api.ApiModel.Keyword
{
    public class KeywordCreateRequestModel
    {
        public string DisplayName { get; set; }
        public string Code { get; set; }

        public IList<LanguageKeywordItemModel> LanguageKeywords { get; set; }
    }


    public class LanguageKeywordItemModel
    {
        public int LanguageId { get; set; }
        public string DisplayValue { get; set; }
        public string Note { get; set; }
    }
}
