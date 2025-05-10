using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Vocabulary.Model.Base;

namespace Vocabulary.Model
{
    public class UserAssessmentModel : BaseModel<int>
    {
        public string ApplicationUserId { get; set; }
        public string Code { get; set; }

        public DateTimeOffset StartDateTime { get; set; }
        public DateTimeOffset EndDateTime { get; set; }
        public double TotalTimeSeconds { get; set; }

        public int TotalCorrectAnswers { get; set; }
        public int TotalIncorrectAnswers { get; set; }
        public double MaxScore { get; set; }
        public double Score { get; set; }


        public IList<UserAssessmentQuestionModel> UserAssessmentQuestions { get; set; }

    }
}
