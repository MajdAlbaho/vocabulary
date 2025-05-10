using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoffeeCode.DataBase.Base.Repository;
using CoffeeCode.Models.DataTables;
using CoffeeCode.ServiceLayer.Base;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Vocabulary.Database.Entities;
using Vocabulary.Model;
using Vocabulary.ServiceLayer.IServices;

namespace Vocabulary.ServiceLayer.Services
{
    public class UserAssessmentService : BaseService<int, UserAssessmentModel, UserAssessment>, IUserAssessmentService
    {
        private readonly IMapper _mapper;
        private readonly IBaseRepository<int, UserAssessmentQuestion> _userAssessmentQuestionRepository;

        public UserAssessmentService(IMapper mapper, IBaseRepository<int, UserAssessment> baseRepository, IHttpContextAccessor httpContextAccessor,
                                IBaseRepository<int, UserAssessmentQuestion> userAssessmentQuestionRepository) : base(mapper, baseRepository, httpContextAccessor) {
            _mapper = mapper;
            _userAssessmentQuestionRepository = userAssessmentQuestionRepository;
        }

        public override async Task<UserAssessmentModel> GetById(int id) {
            var assessment = await Get().AsNoTracking()
                .Include(e => e.UserAssessmentQuestions.Where(e => e.DeletedDate == null))
                .FirstOrDefaultAsync(e => e.Id == id);

            return _mapper.Map<UserAssessmentModel>(assessment);
        }

        public override Task<UserAssessmentModel> Add(UserAssessmentModel modelToAdd) {
            modelToAdd.CreatedBy = GetUserIdFromToken();
            modelToAdd.CreatedDate = DateTime.UtcNow;

            foreach (var question in modelToAdd.UserAssessmentQuestions) {
                question.CreatedBy = GetUserIdFromToken();
                question.CreatedDate = DateTime.UtcNow;
            }

            return Add(modelToAdd);
        }

        public async Task<DataTableResult<List<UserAssessmentModel>>> GetAssessments(string searchValue, int sortColumn, string sortDirection, int skip, int pageSize) {
            var query = Get().AsNoTracking();
            var totalRecord = query.Count();

            if (!string.IsNullOrWhiteSpace(searchValue)) {
                query = query.Where(e =>
                    e.Code.Contains(searchValue)
                );
            }
            var filteredRecord = query.Count();
            switch (sortColumn) {
                case 0:
                    query = sortDirection == "asc" ? query.OrderBy(e => e.Code) : query.OrderByDescending(e => e.Code);
                    break;
                default:
                    query = query.OrderBy(e => e.Code);
                    break;
            }

            var assessments = await query.Skip(skip).Take(pageSize).ToListAsync();
            return new DataTableResult<List<UserAssessmentModel>> {
                data = _mapper.Map<List<UserAssessmentModel>>(assessments),
                recordsFiltered = filteredRecord,
                recordsTotal = totalRecord
            };
        }

        public async Task<UserAssessmentModel> CreateAssessment(string applicationUserId, string assessmentCode, int maxScore) {
            var userId = GetUserIdFromToken();
            var assessmentModel = new UserAssessmentModel {
                ApplicationUserId = applicationUserId,
                Code = assessmentCode,
                MaxScore = maxScore,
                StartDateTime = DateTimeOffset.UtcNow,
                CreatedDate = DateTimeOffset.UtcNow,
                CreatedBy = userId
            };

            var result = await _userAssessmentQuestionRepository.FromSqlRaw($"EXEC dbo.GetRandomKeywordLanguage @UserAssessmentId = 0,@CreatedBy = '{userId}', @Total = {maxScore}").AsNoTracking().ToListAsync();
            assessmentModel.UserAssessmentQuestions = _mapper.Map<List<UserAssessmentQuestionModel>>(result);
            if (result.Count < maxScore)
                assessmentModel.MaxScore = result.Count;

            return await base.Add(assessmentModel);
        }

        public async Task<UserAssessmentModel> SubmitAssessment(int assessmentId, List<UserAssessmentQuestionModel> userInputs) {
            var userId = GetUserIdFromToken();
            var assessment = await GetById(assessmentId);

            foreach (var userInput in userInputs) {
                var question = assessment.UserAssessmentQuestions.FirstOrDefault(e => e.Id == userInput.Id);
                if (question == null)
                    continue;

                question.IsCorrect = string.Equals(RemoveAlPrefix(userInput.UserInput), RemoveAlPrefix(question.Answer), StringComparison.OrdinalIgnoreCase);
                question.UserInput = userInput.UserInput;
            }

            assessment.TotalCorrectAnswers = assessment.UserAssessmentQuestions.Count(e => e.IsCorrect);
            assessment.TotalIncorrectAnswers = assessment.UserAssessmentQuestions.Count(e => !e.IsCorrect);
            assessment.Score = assessment.TotalCorrectAnswers;
            assessment.EndDateTime = DateTimeOffset.UtcNow;
            assessment.TotalTimeSeconds = (assessment.EndDateTime - assessment.StartDateTime).TotalSeconds;
            assessment.LastModifiedDate = DateTimeOffset.UtcNow;
            assessment.ModifiedBy = userId;


            await base.Update(assessment);
            return assessment;
        }

        private string RemoveAlPrefix(string input) {
            if (input.StartsWith("ال", StringComparison.OrdinalIgnoreCase)) {
                return input.Substring(2); // Skip the "ال" part (2 characters)
            }

            return input;
        }
    }
}
