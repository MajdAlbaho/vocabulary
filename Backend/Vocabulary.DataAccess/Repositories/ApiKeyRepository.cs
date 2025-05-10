using System;
using System.Threading.Tasks;
using CoffeeCode.DataBase.Base.Repository;
using Microsoft.EntityFrameworkCore;
using Vocabulary.DataAccess.Interfaces;
using Vocabulary.Database.Entities;

namespace Vocabulary.DataAccess.Repositories
{
    public class ApiKeyRepository(DbContext context) : BaseRepository<int, ApiKey>(context), IApiKeyRepository
    {
        public async Task Revoke(int id) {
            var apiKey = await (context as VocabularyDbContext)?.ApiKeys.FirstOrDefaultAsync(e => e.Id == id);
            if (apiKey == null)
                throw new Exception("Invalid ApiKey Id");

            apiKey.IsActive = false;
            await context.SaveChangesAsync();
        }
    }
}
