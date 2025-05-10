using Vocabulary.Model.Base;

namespace Vocabulary.Model
{
    public class UserAssessmentQuestionModel : BaseModel<int>
    {
        public int UserAssessmentId { get; set; }
        public string Question { get; set; }
        public string QuestionLanguage { get; set; }

        public string Answer { get; set; }
        public string AnswerLanguage { get; set; }

        public string UserInput { get; set; }
        public bool IsCorrect { get; set; }
        public bool Skipped { get; set; }
    }
}
