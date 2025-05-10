using System.ComponentModel.DataAnnotations;
using CoffeeCode.DataBase.Base;

namespace Vocabulary.Database.Entities
{
    public class LanguageKeyword : BaseEntity<int>
    {
        public int LanguageId { get; set; }
        public int KeywordId { get; set; }


        [MaxLength(450)]
        public string ApplicationUserId { get; set; }

        [MaxLength(128)]
        public string DisplayValue { get; set; }

        [MaxLength(256)]
        public string Note { get; set; }


        public virtual Language Language { get; set; }
        public virtual Keyword Keyword { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
