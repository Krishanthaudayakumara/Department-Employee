using System.Collections.Generic;
using Server.DTOs;
using Server.Models;


namespace Server.Interface
{


    public interface IDepartmentService
    {
        IEnumerable<Department> GetDepartments();
        Department AddDepartment(DepartmentDto departmentDto);
        Department UpdateDepartment(int departmentId, DepartmentDto departmentDto);
        bool DeleteDepartment(int departmentId);
    }
}