using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Vocabulary.Database.Entities;
using Vocabulary.Security;

namespace Vocabulary.Database
{
    public class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider, VocabularyDbContext context) {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            SeedAdminUser(context, userManager);
            SeedDefaultLanguages(context);
        }

        private static void SeedAdminUser(VocabularyDbContext context, UserManager<ApplicationUser> userManager) {
            var adminUser = context.Users.FirstOrDefault(e => e.UserName == "admin");
            if (adminUser == null) {
                var identityUser = new ApplicationUser {
                    UserName = "admin",
                    Email = "admin@mail.com"
                };

                var result = userManager.CreateAsync(identityUser, "Admin@123").Result;
                if (result.Succeeded) {
                    var claims = Claims.GetAll();
                    var userClaimResult = userManager.AddClaimsAsync(identityUser, claims.Select(e => new System.Security.Claims.Claim(e.ClaimType, e.ClaimValue))).Result;
                }
            }
        }

        private static void SeedDefaultLanguages(VocabularyDbContext context) {
            if (!context.Languages.Any()) {
                context.Languages.AddRange(
                    new Language { DisplayName = "English", CreatedBy = "System", CreatedDate = DateTimeOffset.UtcNow },
                    new Language { DisplayName = "Arabic", CreatedBy = "System", CreatedDate = DateTimeOffset.UtcNow }
                );
                context.SaveChanges();
            }
        }
    }
}
