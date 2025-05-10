using System.Collections.Generic;
using Vocabulary.Model.Base;

namespace Vocabulary.Model
{
    public class KeywordModel : BaseModel<int>
    {
        public string DisplayName { get; set; }
        public string Code { get; set; }


        public List<LanguageKeywordModel> LanguageKeywords { get; set; }
    }
}
