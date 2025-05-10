namespace Vocabulary.Api.ApiModel.LanguageKeyword
{
    public class LanguageKeywordCreateRequestModel
    {
        public int KeywordId { get; set; }
        public int LanguageId { get; set; }
        public string DisplayValue { get; set; }
        public string ApplicationUserId { get; set; }
    }
}
