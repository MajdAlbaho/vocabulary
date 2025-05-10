using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Vocabulary.Model;
using Vocabulary.Security;
using Vocabulary.ServiceLayer.IServices;
using Vocabulary.Api.ApiModel.UserAssessment;
using CoffeeCode.Models.DataTables;
using CoffeeCode.Library.String;
using Vocabulary.ServiceLayer.Services;
using System.Linq;

namespace Vocabulary.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class UserAssessmentsController(IUserAssessmentService userAssessmentService) : ControllerBase
    {
        [HttpGet]
        [Authorize(Policy = Policies.ManageAssessmentsPolicy)]
        public async Task<IActionResult> GetAll() {
            try {
                var assessments = await userAssessmentService.GetAll();
                return Ok(assessments);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpGet("GetAssessments")]
        [Authorize(Policy = Policies.ManageAssessmentsPolicy)]
        public async Task<IActionResult> GetAssessments(UserAssessmentRequestModel requestModel) {
            try {
                var dataTableParamResult = new DataTableParamResult(requestModel.DataTableParam);
                var assessments = await userAssessmentService.GetAssessments(dataTableParamResult.SearchValue, dataTableParamResult.SortColumn,
                        dataTableParamResult.SortDirection, dataTableParamResult.Skip, dataTableParamResult.PageSize);

                return Ok(assessments);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Policy = Policies.ManageAssessmentsPolicy)]
        public async Task<IActionResult> Get(int id) {
            try {
                var assessment = await userAssessmentService.GetById(id);
                return Ok(assessment);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPost]
        [Authorize(Policy = Policies.ManageAssessmentsPolicy)]
        public async Task<IActionResult> Post(UserAssessmentCreateRequestModel createRequestModel) {
            try {
                var assessmentCode = StringGenerator.Generate(4, includeCapitalLetters: true, includeNumbers: true);
                var createdRecord = await userAssessmentService.CreateAssessment(createRequestModel.ApplicationUserId, assessmentCode, createRequestModel.MaxScore);
                return Ok(createdRecord);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpPost("Submit")]
        [Authorize(Policy = Policies.ManageAssessmentsPolicy)]
        public async Task<IActionResult> Submit(UserAssessmentSubmitRequestModel submitRequestModel) {
            try {
                var userInputs = submitRequestModel.Answers.Select(e => new UserAssessmentQuestionModel {
                    Id = e.Id,
                    UserInput = e.Answer
                }).ToList();

                var updatedAssessment = await userAssessmentService.SubmitAssessment(submitRequestModel.AssessmentId, userInputs);
                return Ok(updatedAssessment.Id);
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.ManageAssessmentsPolicy)]
        public async Task<IActionResult> Post(int id) {
            try {
                await userAssessmentService.Delete(id);
                return Ok();
            } catch (Exception ex) {
                return BadRequest(new { message = ex.GetBaseException().Message });
            }
        }
    }

    public partial class String
    {
        public static void Test() {

        }
    }
}
