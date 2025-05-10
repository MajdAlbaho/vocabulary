using System.ComponentModel.DataAnnotations;
using CoffeeCode.DataBase.Base;

namespace Vocabulary.Database.Entities
{
    public class UserAssessmentQuestion : BaseEntity<int>
    {
        public int UserAssessmentId { get; set; }

        [MaxLength(128)]
        public string Question { get; set; }
        [MaxLength(128)]
        public string QuestionLanguage { get; set; }

        [MaxLength(128)]
        public string Answer { get; set; }
        [MaxLength(128)]
        public string AnswerLanguage { get; set; }

        public string UserInput { get; set; }
        public bool IsCorrect { get; set; }
        public bool Skipped { get; set; }

        public virtual UserAssessment UserAssessment { get; set; }
    }
}
