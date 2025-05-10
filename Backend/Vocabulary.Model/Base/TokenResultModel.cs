using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;

namespace Vocabulary.Model.Base
{
    public class TokenResultModel
    {
        public TokenResultModel(string token, string refreshToken) {
            Token = token;
            RefreshToken = refreshToken;
        }

        public string Token { get; set; }
        public string RefreshToken { get; set; }

        public IList<Claim> Claims { get; set; }
        public string UserId { get; set; }
    }
}
