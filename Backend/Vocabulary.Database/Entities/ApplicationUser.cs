using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Vocabulary.Database.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public virtual ICollection<LanguageKeyword> LanguageKeywords { get; set; }
        public virtual UserRefreshToken UserRefreshToken { get; set; }
        public virtual ICollection<UserAssessment> UserAssessments { get; set; }
    }
}
