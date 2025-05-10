namespace Vocabulary.Api.ApiModel.LanguageKeyword
{
    public class LanguageKeywordModifyRequestModel
    {
        public int Id { get; set; }
        public int KeywordId { get; set; }
        public int LanguageId { get; set; }
        public string DisplayValue { get; set; }
        public string ApplicationUserId { get; set; }
    }
}
