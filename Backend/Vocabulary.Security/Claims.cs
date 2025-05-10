using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Vocabulary.Model;

namespace Vocabulary.Security
{
    public class Claims
    {
        internal static ApplicationClaimModel ManageUsersPolicyClaim = new("Users", "Manage", "User Settings", "Manage Users", "Allow to manage users");
        internal static ApplicationClaimModel ResetUserPasswordPolicyClaim = new("Users", "ResetPassword", "User Settings", "Reset user password", "Allow to reset user password");

        internal static ApplicationClaimModel ManageRolesPolicyClaim = new("Roles", "Manage", "Roles Settings", "Manage Roles", "Allow to manage roles");

        internal static ApplicationClaimModel ManageApiKeysPolicyClaim = new("ApiKeys", "Manage", "Api-Key Settings", "Manage Api-Keys", "Allow to manage api-keys");
        internal static ApplicationClaimModel RevokeApiKeyPolicyClaim = new("ApiKeys", "Revoke", "Api-Key Settings", "Revoke Api-Key", "Allow to revoke api-key");

        internal static ApplicationClaimModel ManageKeywordsPolicyClaim = new("Keywords", "Manage", "Keywords Management", "Manage Keywords", "Allow to manage keywords");
        
        internal static ApplicationClaimModel ManageLanguagesPolicyClaim = new("Languages", "Manage", "Languages Management", "Manage languages", "Allow to manage languages");

        internal static ApplicationClaimModel ManageAssessmentsPolicyClaim = new("Assessments", "Manage", "Assessments Management", "Manage assessments", "Allow to manage assessments");

        public static List<ApplicationClaimModel> GetAll() {
            var claims = typeof(Claims)
                    .GetFields(BindingFlags.NonPublic | BindingFlags.Static)
                    .Where(f => f.FieldType == typeof(ApplicationClaimModel))
                    .Select(f => (ApplicationClaimModel)f.GetValue(null))
                    .ToList();

            return claims;
        }
    }
}
