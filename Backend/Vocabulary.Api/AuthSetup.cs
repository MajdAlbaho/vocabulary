using Microsoft.AspNetCore.Http;

namespace Vocabulary.Api
{
    public class AuthSetup
    {
        public static CookieOptions CookieOptions = new() {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None
        };
    }
}
