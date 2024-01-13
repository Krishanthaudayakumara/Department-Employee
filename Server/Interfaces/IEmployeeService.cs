
using Server.DTOs;
using Server.Models;

namespace Server.Interface
{
    public interface IEmployeeService
    {
        IEnumerable<Employee> GetEmployees();
        Employee AddEmployee(EmployeeDto employeeDto);
        Employee UpdateEmployee(int employeeId, EmployeeDto employeeDto);
        bool DeleteEmployee(int employeeId);
    }
}
