using System.Collections.Generic;

namespace Vocabulary.Api.ApiModel.Keyword
{
    public class KeywordModifyRequestModel
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public string Code { get; set; }

        public IList<LanguageKeywordItemModel> LanguageKeywords { get; set; }
    }
}
