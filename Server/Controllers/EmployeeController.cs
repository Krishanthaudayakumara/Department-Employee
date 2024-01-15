using Microsoft.AspNetCore.Mvc;
using Server.DTOs;
using Server.Interface;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/employees")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public IActionResult GetEmployees()
        {
            var employees = _employeeService.GetEmployees();
            return Ok(employees);
        }

        [HttpGet("details")]
        public IActionResult GetEmployeeDetails()
        {
            try
            {
                var employeeDetails = _employeeService.GetEmployeesDetails();
                return Ok(employeeDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("details/department/{departmentID}")]
        public IActionResult GetEmployeeDetailsByDepartmentID(int departmentID)
        {
            try
            {
                var employeeDetails = _employeeService.GetEmployeeDetailsByDepartmentID(departmentID);
                return Ok(employeeDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }


        }

        [HttpGet("details/departmentcode/{departmentCode}")]
        public IActionResult GetEmployeeDetailsByDepartmentCode(string departmentCode)
        {
            try
            {
                var employeeDetails = _employeeService.GetEmployeeDetailsByDepartmentCode(departmentCode);
                return Ok(employeeDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }


        }

        [HttpPost]
        public IActionResult AddEmployee([FromBody] EmployeeDto employeeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var newEmployee = _employeeService.AddEmployee(employeeDto);
                if (newEmployee == null)
                {
                    return BadRequest(new { error = "Failed to add employee." });
                }

                var createdEmployeeResult = CreatedAtAction(nameof(GetEmployeeById), new { id = newEmployee.EmployeeID }, newEmployee);
                createdEmployeeResult.StatusCode = 200;
                return createdEmployeeResult;
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEmployee(int id, [FromBody] EmployeeDto employeeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedEmployee = _employeeService.UpdateEmployee(id, employeeDto);

                if (updatedEmployee == null)
                {
                    return NotFound();
                }

                return Ok(updatedEmployee);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            var success = _employeeService.DeleteEmployee(id);

            if (!success)
            {
                return NotFound();
            }

            return Ok(new { message = "Employee deleted successfully." });
        }

        [HttpGet("{id}", Name = "GetEmployeeById")]
        public IActionResult GetEmployeeById(int id)
        {
            var employee = _employeeService.GetEmployees().FirstOrDefault(e => e.EmployeeID == id);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }
    }
}
