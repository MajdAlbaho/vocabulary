using System;
using System.Collections.Generic;
using Vocabulary.Model.Base;

namespace Vocabulary.Api.ApiModel.ApiKey
{
    public class ApiKeyCreateRequestModel
    {
        public string DisplayName { get; set; }
        public DateTimeOffset ExpirationDate { get; set; }

        public List<ClaimModel> ApiKeyClaims { get; set; }
    }
}
