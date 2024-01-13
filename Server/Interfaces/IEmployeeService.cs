
using Server.DTOs;
using Server.Models;

namespace Server.Interface
{
    public interface IEmployeeService
    {
        IEnumerable<Employee> GetEmployees();
        IEnumerable<EmployeeDetailsDto> GetEmployeesDetails();

        IEnumerable<EmployeeDetailsDto> GetEmployeeDetailsByDepartmentCode(string departmentCode);

        IEnumerable<EmployeeDetailsDto> GetEmployeeDetailsByDepartmentID(int departmentID);

        Employee AddEmployee(EmployeeDto employeeDto);
        Employee UpdateEmployee(int employeeId, EmployeeDto employeeDto);
        bool DeleteEmployee(int employeeId);
    }
}
