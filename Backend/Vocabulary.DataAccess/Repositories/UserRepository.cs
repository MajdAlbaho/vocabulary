using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Vocabulary.DataAccess.Interfaces;
using Vocabulary.Database.Entities;
using Vocabulary.Security.Helpers;

namespace Vocabulary.DataAccess.Repositories
{
    public class UserRepository(VocabularyDbContext context) : IUserRepository
    {
        private const string _modifiedBy = "System";

        public async Task AddOrUpdateToken(string userId, string tokenHash, IList<Claim> claims) {
            var existUserToken = await context.UserRefreshToken.FirstOrDefaultAsync(e => e.ApplicationUserId == userId);
            var userClaims = JsonSerializer.Serialize(claims.Select(e => new { type = e.Type, value = e.Value }));
            var hashedClaims = HashHelper.HashStringSHA256(userClaims);

            if (existUserToken == null) {
                await context.UserRefreshToken.AddAsync(new UserRefreshToken() {
                    ApplicationUserId = userId,
                    UserCliams = hashedClaims,
                    TokenHash = tokenHash,
                    CreatedDate = DateTimeOffset.UtcNow,
                    CreatedBy = _modifiedBy
                });
                await context.SaveChangesAsync();
            } else {
                existUserToken.UserCliams = hashedClaims;
                existUserToken.TokenHash = tokenHash;
                existUserToken.LastModifiedDate = DateTimeOffset.UtcNow;
                existUserToken.ModifiedBy = _modifiedBy;

                await context.SaveChangesAsync();
            }
        }

        public async Task<string> VerifyUserByTokenHash(string tokenHash) {
            var result = await context.UserRefreshToken
                .Include(e => e.ApplicationUser)
                .FirstOrDefaultAsync(e => e.TokenHash == tokenHash && e.Revoked == false);
            if (result == null)
                return null;

            var claims = new List<Claim>
            {
                    new(ClaimTypes.NameIdentifier, result.ApplicationUserId),
                    new(ClaimTypes.Name, result.ApplicationUser.UserName),
            };
            var userClaims = await context.UserClaims.Where(e => e.UserId == result.ApplicationUserId).ToListAsync();
            claims.AddRange(userClaims.Select(claim => new Claim(claim.ClaimType, claim.ClaimValue)));
            var userClaimJson = JsonSerializer.Serialize(claims.Select(e => new { type = e.Type, value = e.Value }));
            var hashedClaims = HashHelper.HashStringSHA256(userClaimJson);

            if (hashedClaims != result.UserCliams)
                return null;

            return result?.ApplicationUserId;
        }
    }
}
