using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vocabulary.Database.Migrations
{
    /// <inheritdoc />
    public partial class CreateAssessmentQuestions2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAssessment_AspNetUsers_ApplicationUserId",
                table: "UserAssessment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserAssessment",
                table: "UserAssessment");

            migrationBuilder.RenameTable(
                name: "UserAssessment",
                newName: "UserAssessments");

            migrationBuilder.RenameIndex(
                name: "IX_UserAssessment_ApplicationUserId",
                table: "UserAssessments",
                newName: "IX_UserAssessments_ApplicationUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserAssessments",
                table: "UserAssessments",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "UserAssessmentQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KeywordId = table.Column<int>(type: "int", nullable: false),
                    Question = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    Skipped = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    LastModifiedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    ModifiedBy = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DeletedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAssessmentQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserAssessmentQuestions_Keywords_KeywordId",
                        column: x => x.KeywordId,
                        principalTable: "Keywords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserAssessmentQuestions_KeywordId",
                table: "UserAssessmentQuestions",
                column: "KeywordId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAssessments_AspNetUsers_ApplicationUserId",
                table: "UserAssessments",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAssessments_AspNetUsers_ApplicationUserId",
                table: "UserAssessments");

            migrationBuilder.DropTable(
                name: "UserAssessmentQuestions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserAssessments",
                table: "UserAssessments");

            migrationBuilder.RenameTable(
                name: "UserAssessments",
                newName: "UserAssessment");

            migrationBuilder.RenameIndex(
                name: "IX_UserAssessments_ApplicationUserId",
                table: "UserAssessment",
                newName: "IX_UserAssessment_ApplicationUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserAssessment",
                table: "UserAssessment",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAssessment_AspNetUsers_ApplicationUserId",
                table: "UserAssessment",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
