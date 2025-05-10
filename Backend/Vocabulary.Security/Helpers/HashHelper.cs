using System.Security.Cryptography;
using System.Text;

namespace Vocabulary.Security.Helpers
{
    public static class HashHelper
    {
        public static string HashStringSHA256(string input) {
            using (var sha256 = SHA256.Create()) {
                byte[] data = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));

                StringBuilder sb = new StringBuilder();
                foreach (byte b in data) {
                    sb.Append(b.ToString("x2"));
                }

                return sb.ToString();
            }
        }
    }
}
