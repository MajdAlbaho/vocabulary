using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vocabulary.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserQues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAssessmentQuestions_Keywords_KeywordId",
                table: "UserAssessmentQuestions");

            migrationBuilder.DropIndex(
                name: "IX_UserAssessmentQuestions_KeywordId",
                table: "UserAssessmentQuestions");

            migrationBuilder.DropColumn(
                name: "KeywordId",
                table: "UserAssessmentQuestions");

            migrationBuilder.AddColumn<string>(
                name: "AnswerLanguage",
                table: "UserAssessmentQuestions",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QuestionLanguage",
                table: "UserAssessmentQuestions",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserInput",
                table: "UserAssessmentQuestions",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnswerLanguage",
                table: "UserAssessmentQuestions");

            migrationBuilder.DropColumn(
                name: "QuestionLanguage",
                table: "UserAssessmentQuestions");

            migrationBuilder.DropColumn(
                name: "UserInput",
                table: "UserAssessmentQuestions");

            migrationBuilder.AddColumn<int>(
                name: "KeywordId",
                table: "UserAssessmentQuestions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserAssessmentQuestions_KeywordId",
                table: "UserAssessmentQuestions",
                column: "KeywordId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAssessmentQuestions_Keywords_KeywordId",
                table: "UserAssessmentQuestions",
                column: "KeywordId",
                principalTable: "Keywords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
