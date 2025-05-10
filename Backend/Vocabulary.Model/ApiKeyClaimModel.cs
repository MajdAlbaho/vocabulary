using Vocabulary.Model.Base;

namespace Vocabulary.Model
{
    public class ApiKeyClaimModel : BaseModel<int>
    {
        public int ApiKeyId { get; set; }
        public string ClaimType { get; set; }
        public string ClaimValue { get; set; }
    }
}
