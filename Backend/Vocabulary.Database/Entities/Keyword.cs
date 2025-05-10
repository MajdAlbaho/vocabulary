using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CoffeeCode.DataBase.Base;

namespace Vocabulary.Database.Entities
{
    public class Keyword : BaseEntity<int>
    {
        [MaxLength(128)]
        public string DisplayName { get; set; }


        [MaxLength(64)]
        public string Code { get; set; }

        public virtual ICollection<LanguageKeyword> LanguageKeywords { get; set; }
    }
}
