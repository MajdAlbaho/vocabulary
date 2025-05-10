using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CoffeeCode.DataBase.Base;

namespace Vocabulary.Database.Entities
{
    public class ApiKey : BaseEntity<int>
    {
        [MaxLength(128)]
        public string Domain { get; set; }

        [MaxLength(128)]
        public string DisplayName { get; set; }

        public DateTimeOffset ExpirationDate { get; set; }

        public bool IsActive { get; set; }

        [MaxLength(128)]
        public string Key { get; set; }


        public virtual ICollection<ApiKeyClaim> ApiKeyClaims { get; set; }
    }
}
