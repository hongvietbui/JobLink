using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobLink_Backend.Migrations
{
    /// <inheritdoc />
    public partial class updatedatabasev11 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NationalIdFront",
                table: "Users",
                newName: "NationalIdFrontUrl");

            migrationBuilder.RenameColumn(
                name: "NationalIdBack",
                table: "Users",
                newName: "NationalIdBackUrl");

            migrationBuilder.AddColumn<int>(
                name: "NationalIdStatus",
                table: "Users",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NationalIdStatus",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "NationalIdFrontUrl",
                table: "Users",
                newName: "NationalIdFront");

            migrationBuilder.RenameColumn(
                name: "NationalIdBackUrl",
                table: "Users",
                newName: "NationalIdBack");
        }
    }
}
