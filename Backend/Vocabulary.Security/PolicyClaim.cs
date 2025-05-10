using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Vocabulary.Model.Base;

namespace Vocabulary.Security
{
    public class PolicyClaim(string policyName, string claimType, string claimValue)
    {
        public string PolicyName { get; set; } = policyName;
        public ClaimModel Claim { get; set; } = new(claimType, claimValue);

        private static IList<PolicyClaim> GetAll() {
            return
            [
                new(Policies.ManageUsersPolicy, Claims.ManageUsersPolicyClaim.ClaimType,Claims.ManageUsersPolicyClaim.ClaimValue),
                new(Policies.ResetUserPasswordPolicy, Claims.ResetUserPasswordPolicyClaim.ClaimType,Claims.ResetUserPasswordPolicyClaim.ClaimValue),
                new(Policies.ManageRolesPolicy, Claims.ManageRolesPolicyClaim.ClaimType,Claims.ManageRolesPolicyClaim.ClaimValue),
                new(Policies.ManageApiKeysPolicy, Claims.ManageApiKeysPolicyClaim.ClaimType,Claims.ManageApiKeysPolicyClaim.ClaimValue),
                new(Policies.RevokeApiKeyPolicy, Claims.RevokeApiKeyPolicyClaim.ClaimType,Claims.RevokeApiKeyPolicyClaim.ClaimValue),
                new(Policies.ManageKeywordsPolicy, Claims.ManageKeywordsPolicyClaim.ClaimType,Claims.ManageKeywordsPolicyClaim.ClaimValue),
                new(Policies.ManageLanguagesPolicy, Claims.ManageLanguagesPolicyClaim.ClaimType,Claims.ManageLanguagesPolicyClaim.ClaimValue),
                new(Policies.ManageAssessmentsPolicy, Claims.ManageAssessmentsPolicyClaim.ClaimType,Claims.ManageAssessmentsPolicyClaim.ClaimValue),
            ];
        }

        public static void RegisterPolicies(AuthorizationOptions options) {
            var policyClaims = GetAll();
            foreach (var policyClaim in policyClaims) {
                options.AddPolicy(policyClaim.PolicyName, policy => { policy.RequireClaim(policyClaim.Claim.ClaimType, policyClaim.Claim.ClaimValue); });
            }
        }
    }
}
