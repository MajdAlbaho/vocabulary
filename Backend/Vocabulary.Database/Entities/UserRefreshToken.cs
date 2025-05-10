using System.ComponentModel.DataAnnotations;
using CoffeeCode.DataBase.Base;

namespace Vocabulary.Database.Entities
{
    public class UserRefreshToken : BaseEntity<int>
    {
        [MaxLength(450)]
        public string ApplicationUserId { get; set; }

        [MaxLength(512)]
        public string TokenHash { get; set; }


        [MaxLength(4096)]
        public string UserCliams { get; set; }
        public bool Revoked { get; set; }


        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
