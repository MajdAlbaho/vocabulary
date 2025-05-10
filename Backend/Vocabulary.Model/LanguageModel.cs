using Vocabulary.Model.Base;

namespace Vocabulary.Model
{
    public class LanguageModel : BaseModel<int>
    {
        public string DisplayName { get; set; }
        public string Code { get; set; }
    }
}
