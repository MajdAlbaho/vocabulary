using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Vocabulary.Database.Entities
{
    public class VocabularyDbContext : IdentityDbContext<ApplicationUser>
    {
        public VocabularyDbContext() { }

        public VocabularyDbContext(DbContextOptions<VocabularyDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            //optionsBuilder.UseSqlServer("Server=MAJD-PC;Database=Vocabulary;Trusted_Connection=True;TrustServerCertificate=True");
        }

        public DbSet<UserRefreshToken> UserRefreshToken { get; set; }


        public DbSet<Language> Languages { get; set; }
        public DbSet<Keyword> Keywords { get; set; }
        public DbSet<LanguageKeyword> LanguageKeywords { get; set; }
        public DbSet<ApiKey> ApiKeys { get; set; }
        public DbSet<ApiKeyClaim> ApiKeyClaims { get; set; }
        public DbSet<UserAssessment> UserAssessments { get; set; }
        public DbSet<UserAssessmentQuestion> UserAssessmentQuestions { get; set; }
    }
}


//SET ANSI_NULLS ON
//GO
//SET QUOTED_IDENTIFIER ON
//GO
//ALTER PROCEDURE [dbo].[GetRandomKeywordLanguage]
//(
//	@UserAssessmentId INT,
//	@CreatedBy nvarchar(64),
//    @Total INT
//)
//AS
//BEGIN
//    WITH Randomized AS (
//        SELECT DisplayValue as Question,Languages.DisplayName as QuestionLanguage, KeywordId, LanguageId ,ROW_NUMBER() OVER (PARTITION BY KeywordId ORDER BY NEWID()) AS rn
//        FROM LanguageKeywords
//		INNER JOIN Languages ON Languages.Id = LanguageKeywords.LanguageId
//    )
//    SELECT 0 as Id, @UserAssessmentId AS UserAssessmentId, Question, QuestionLanguage, Answer, AnswerLanguage,
//		null as UserInput,CAST(0 as bit) as IsCorrect, CAST(0 as bit) as Skipped, @CreatedBy as CreatedBy, SYSDATETIMEOFFSET() as CreatedDate, null as LastModifiedDate, null as ModifiedBy, null as DeletedDate, null as DeletedBy
//    FROM Randomized
//	CROSS APPLY (
//			SELECT TOP 1 DisplayValue as Answer , Languages.DisplayName as AnswerLanguage
//			FROM LanguageKeywords
//			INNER JOIN Languages ON Languages.Id = LanguageKeywords.LanguageId
//			WHERE KeywordId = Randomized.KeywordId AND LanguageId != Randomized.LanguageId
//		) as crossedKeyword
//    WHERE rn = 1
//    ORDER BY NEWID()
//    OFFSET 0 ROWS FETCH NEXT @Total ROWS ONLY;
//END