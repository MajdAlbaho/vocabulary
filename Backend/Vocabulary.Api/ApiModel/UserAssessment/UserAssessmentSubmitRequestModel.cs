using System.Collections.Generic;

namespace Vocabulary.Api.ApiModel.UserAssessment
{
    public class UserAssessmentSubmitRequestModel
    {
        public int AssessmentId { get; set; }
        public List<UserAssessmentQuestionAnswerRequestModel> Answers { get; set; }
    }

    public class UserAssessmentQuestionAnswerRequestModel 
    {
        public int Id { get; set; }
        public string Answer { get; set; }
    }
}
