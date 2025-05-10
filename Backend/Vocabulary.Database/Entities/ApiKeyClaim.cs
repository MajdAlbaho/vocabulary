using System.ComponentModel.DataAnnotations;
using CoffeeCode.DataBase.Base;

namespace Vocabulary.Database.Entities
{
    public class ApiKeyClaim : BaseEntity<int>
    {
        public int ApiKeyId { get; set; }

        [MaxLength(128)]
        public string ClaimType { get; set; }

        [MaxLength(128)]
        public string ClaimValue { get; set; }


        public virtual ApiKey ApiKey { get; set; }
    }
}
