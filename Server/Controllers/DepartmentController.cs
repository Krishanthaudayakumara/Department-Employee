using Microsoft.AspNetCore.Mvc;
using Server.DTOs;
using Server.Interface;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/departments")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet]
        public IActionResult GetDepartments()
        {
            var departments = _departmentService.GetDepartments();
            return Ok(departments);
        }

        [HttpPost]
        public IActionResult AddDepartment([FromBody] DepartmentDto departmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var newDepartment = _departmentService.AddDepartment(departmentDto);
                if (newDepartment == null)
                {
                    // Handle the case when AddDepartment returns null
                    return BadRequest(new { error = "Failed to add department." });
                }

                var createdDepartmentResult = CreatedAtAction(nameof(GetDepartmentById), new { id = newDepartment.DepartmentID }, newDepartment);
                createdDepartmentResult.StatusCode = 200;
                return createdDepartmentResult;
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateDepartment(int id, [FromBody] DepartmentDto departmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedDepartment = _departmentService.UpdateDepartment(id, departmentDto);

                if (updatedDepartment == null)
                {
                    return NotFound();
                }

                return Ok(updatedDepartment);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteDepartment(int id)
        {
            var success = _departmentService.DeleteDepartment(id);

            if (!success)
            {
                return NotFound();
            }

            return Ok(new { message = "Department deleted successfully." });
        }

        [HttpGet("{id}", Name = "GetDepartmentById")]
        public IActionResult GetDepartmentById(int id)
        {
            var department = _departmentService.GetDepartments().FirstOrDefault(d => d.DepartmentID == id);

            if (department == null)
            {
                return NotFound();
            }

            return Ok(department);
        }
    }
}
