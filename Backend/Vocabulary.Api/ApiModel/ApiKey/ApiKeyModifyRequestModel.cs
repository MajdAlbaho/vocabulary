using System.Collections.Generic;
using System;
using Vocabulary.Model.Base;

namespace Vocabulary.Api.ApiModel.ApiKey
{
    public class ApiKeyModifyRequestModel
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public DateTimeOffset ExpirationDate { get; set; }

        public List<ClaimModel> ApiKeyClaims { get; set; }
    }
}
