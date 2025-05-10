using System;
using System.Collections.Generic;
using Vocabulary.Model.Base;

namespace Vocabulary.Model
{
    public class ApiKeyModel : BaseModel<int>
    {
        public string Domain { get; set; }
        public string DisplayName { get; set; }
        public DateTimeOffset ExpirationDate { get; set; }
        public bool IsActive { get; set; }
        public string Key { get; set; }

        public List<ApiKeyClaimModel> ApiKeyClaims { get; set; }
    }
}
