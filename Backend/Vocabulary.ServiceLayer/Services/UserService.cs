using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using Vocabulary.ServiceLayer.IServices;
using Vocabulary.Database.Entities;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Vocabulary.Model.Base;
using Vocabulary.DataAccess.Interfaces;
using Vocabulary.Security.Helpers;

namespace Vocabulary.ServiceLayer.Services
{
    public class UserService(IUserRepository userRepository, UserManager<ApplicationUser> userManager, IConfiguration configuration) : IUserService
    {
        private static readonly DateTime _tokenLifeTime = DateTime.UtcNow.AddHours(5);

        public async Task<TokenResultModel> Login(string userName, string password) {
            var identityUser = await userManager.FindByNameAsync(userName);
            if (identityUser == null)
                throw new Exception("Login failed, Incorrect user name or password");

            var result = userManager.PasswordHasher.VerifyHashedPassword(identityUser, identityUser.PasswordHash ?? "", password);
            if (result == PasswordVerificationResult.Failed)
                throw new Exception("Login failed, Incorrect user name or password!");

            var userClaims = await userManager.GetClaimsAsync(identityUser);

            var claims = new List<Claim>
            {
                    new(ClaimTypes.NameIdentifier, identityUser.Id),
                    new(ClaimTypes.Name, identityUser.UserName),
                };
            claims.AddRange(userClaims.Select(claim => new Claim(claim.Type, claim.Value)));

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"] ?? ""));
            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: _tokenLifeTime,
                claims: claims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            var generatedToken = new JwtSecurityTokenHandler().WriteToken(token);
            var refreshToken = Guid.NewGuid().ToString();

            var tokenHash = HashHelper.HashStringSHA256(generatedToken + refreshToken);
            await userRepository.AddOrUpdateToken(identityUser.Id, tokenHash, claims);

            return new TokenResultModel(generatedToken, refreshToken) {
                UserId = identityUser.Id,
                Claims = claims
            };
        }

        private async Task<TokenResultModel> RefreshToken(string userId) {
            var identityUser = await userManager.FindByIdAsync(userId);
            if (identityUser == null)
                throw new Exception("Invalid user id for refresh token");

            var userClaims = await userManager.GetClaimsAsync(identityUser);

            var claims = new List<Claim>
            {
                    new(ClaimTypes.NameIdentifier, identityUser.Id),
                    new(ClaimTypes.Name, identityUser.UserName),
            };
            claims.AddRange(userClaims.Select(claim => new Claim(claim.Type, claim.Value)));

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"] ?? ""));
            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: _tokenLifeTime,
                claims: claims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            var generatedToken = new JwtSecurityTokenHandler().WriteToken(token);
            var refreshToken = Guid.NewGuid().ToString();

            return new TokenResultModel(generatedToken, refreshToken) {
                UserId = identityUser.Id,
                Claims = claims
            };
        }

        public async Task<TokenResultModel> RefreshToken(string token, string refreshToken) {
            if (IsTokenExpired(token)) {
                var hashed = HashHelper.HashStringSHA256(token + refreshToken);
                var userId = await userRepository.VerifyUserByTokenHash(hashed);
                if (userId == null)
                    return null;

                return await RefreshToken(userId);
            }

            return new TokenResultModel(token, refreshToken);
        }


        private bool IsTokenExpired(string token) {
            try {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

                if (jsonToken == null) {
                    throw new Exception("Invalid token format.");
                }

                var expClaim = jsonToken?.Claims.FirstOrDefault(c => c.Type == "exp");

                if (expClaim != null) {
                    var expirationTime = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expClaim.Value)).UtcDateTime;
                    return expirationTime < DateTime.UtcNow;
                } else {
                    throw new Exception("Expiration claim (exp) not found in token.");
                }
            } catch (Exception ex) {
                Console.WriteLine($"Error: {ex.Message}");
                return false;
            }
        }

    }
}
