using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vocabulary.Database.Migrations
{
    /// <inheritdoc />
    public partial class CreateAssessmentQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "MaxScore",
                table: "UserAssessment",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Score",
                table: "UserAssessment",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "TotalCorrectAnswers",
                table: "UserAssessment",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalIncorrectAnswers",
                table: "UserAssessment",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "TotalTimeSeconds",
                table: "UserAssessment",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxScore",
                table: "UserAssessment");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "UserAssessment");

            migrationBuilder.DropColumn(
                name: "TotalCorrectAnswers",
                table: "UserAssessment");

            migrationBuilder.DropColumn(
                name: "TotalIncorrectAnswers",
                table: "UserAssessment");

            migrationBuilder.DropColumn(
                name: "TotalTimeSeconds",
                table: "UserAssessment");
        }
    }
}
