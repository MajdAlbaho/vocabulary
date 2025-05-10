using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vocabulary.Database.Migrations
{
    /// <inheritdoc />
    public partial class CreateAssessmentQuestions3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserAssessmentId",
                table: "UserAssessmentQuestions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserAssessmentQuestions_UserAssessmentId",
                table: "UserAssessmentQuestions",
                column: "UserAssessmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAssessmentQuestions_UserAssessments_UserAssessmentId",
                table: "UserAssessmentQuestions",
                column: "UserAssessmentId",
                principalTable: "UserAssessments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAssessmentQuestions_UserAssessments_UserAssessmentId",
                table: "UserAssessmentQuestions");

            migrationBuilder.DropIndex(
                name: "IX_UserAssessmentQuestions_UserAssessmentId",
                table: "UserAssessmentQuestions");

            migrationBuilder.DropColumn(
                name: "UserAssessmentId",
                table: "UserAssessmentQuestions");
        }
    }
}
