using Vocabulary.Model.Base;

namespace Vocabulary.Model
{
    public class LanguageKeywordModel : BaseModel<int>
    {
        public int LanguageId { get; set; }
        public int KeywordId { get; set; }
        public string ApplicationUserId { get; set; }

        public string DisplayValue { get; set; }
        public string Note { get; set; }
    }
}
