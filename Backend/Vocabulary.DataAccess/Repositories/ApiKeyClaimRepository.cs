using CoffeeCode.DataBase.Base.Repository;
using Microsoft.EntityFrameworkCore;
using Vocabulary.DataAccess.Interfaces;
using Vocabulary.Database.Entities;

namespace Vocabulary.DataAccess.Repositories
{
    internal class ApiKeyClaimRepository(DbContext context) : BaseRepository<int, ApiKeyClaim>(context), IApiKeyClaimRepository;
}
