using System.Collections.Generic;
using System.Threading.Tasks;
using CoffeeCode.DataBase.Interfaces;
using CoffeeCode.Models.DataTables;
using CoffeeCode.ServiceLayer.Base;
using Vocabulary.Database.Entities;
using Vocabulary.Model;

namespace Vocabulary.ServiceLayer.IServices
{
    public interface IUserAssessmentService : IBaseService<int, UserAssessmentModel, UserAssessment>, IInjectable
    {
        Task<DataTableResult<List<UserAssessmentModel>>> GetAssessments(string searchValue, int sortColumn, string sortDirection, int skip, int pageSize);
        Task<UserAssessmentModel> CreateAssessment(string applicationUserId, string assessmentCode, int maxScore);
        Task<UserAssessmentModel> SubmitAssessment(int assessmentId, List<UserAssessmentQuestionModel> userAssessmentAnswers);
    }
}
