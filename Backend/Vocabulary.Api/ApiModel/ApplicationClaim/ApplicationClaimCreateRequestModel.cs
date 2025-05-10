namespace Vocabulary.Api.ApiModel.ApplicationClaim
{
    public class ApplicationClaimCreateRequestModel
    {
        public string ClaimType { get; set; }
        public string ClaimValue { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }
    }
}
