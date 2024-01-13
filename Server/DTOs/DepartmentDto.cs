using System.ComponentModel.DataAnnotations;

namespace Server.DTOs
{
    public class DepartmentDto
    {
        [Required(ErrorMessage = "DepartmentCode is required.")]
        public string DepartmentCode { get; set; }

        [Required(ErrorMessage = "DepartmentName is required.")]
        public string DepartmentName { get; set; }
    }
}