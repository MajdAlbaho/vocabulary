using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CoffeeCode.DataBase.Base;

namespace Vocabulary.Database.Entities
{
    public class UserAssessment : BaseEntity<int>
    {
        [MaxLength(450)]
        public string ApplicationUserId { get; set; }

        [MaxLength(32)]
        public string Code { get; set; }

        public DateTimeOffset StartDateTime { get; set; }
        public DateTimeOffset EndDateTime { get; set; }
        public double TotalTimeSeconds { get; set; }

        public int TotalCorrectAnswers { get; set; }
        public int TotalIncorrectAnswers { get; set; }
        public double MaxScore { get; set; }
        public double Score { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }
        public virtual ICollection<UserAssessmentQuestion> UserAssessmentQuestions { get; set; }
    }
}
