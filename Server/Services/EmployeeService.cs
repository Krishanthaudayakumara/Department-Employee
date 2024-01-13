using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Server.DTOs;
using Server.Interface;
using Server.Models;

namespace Server.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly string _connectionString;

        public EmployeeService(string connectionString)
        {
            _connectionString = connectionString;
        }

        
        private T MapReaderToObject<T>(SqlDataReader reader, Func<SqlDataReader, T> mapFunction)
        {
            T result = mapFunction(reader);
            return result;
        }

        private IEnumerable<T> ExecuteStoredProcedure<T>(string procedureName, SqlParameter[] parameters, Func<SqlDataReader, T> mapFunction)
        {
            List<T> result = new List<T>();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(procedureName, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        if (parameters != null)
                        {
                            command.Parameters.AddRange(parameters);
                        }

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                result.Add(MapReaderToObject(reader, mapFunction));
                            }
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                // Handle SQL exceptions
                Console.WriteLine("SQL Error: " + ex.Message);
                throw;
            }

            return result;
        }

        private Employee MapEmployee(SqlDataReader reader)
        {
            return new Employee
            {
                EmployeeID = (int)reader["EmployeeID"],
                FirstName = reader["FirstName"].ToString(),
                LastName = reader["LastName"].ToString(),
                EmailAddress = reader["EmailAddress"].ToString(),
                DateOfBirth = (DateTime)reader["DateOfBirth"],
                Age = (int)reader["Age"],
                Salary = (decimal)reader["Salary"],
                DepartmentID = (int)reader["DepartmentID"]
            };
        }

        private EmployeeDetailsDto MapEmployeeDetails(SqlDataReader reader)
        {
            return new EmployeeDetailsDto
            {
                EmployeeID = (int)reader["EmployeeID"],
                FirstName = reader["FirstName"].ToString(),
                LastName = reader["LastName"].ToString(),
                EmailAddress = reader["EmailAddress"].ToString(),
                DateOfBirth = (DateTime)reader["DateOfBirth"],
                Age = (int)reader["Age"],
                Salary = (decimal)reader["Salary"],
                DepartmentID = (int)reader["DepartmentID"],
                DepartmentCode = reader["DepartmentCode"].ToString(),
                DepartmentName = reader["DepartmentName"].ToString()
            };
        }

        public IEnumerable<Employee> GetEmployees()
        {
            SqlParameter[] parameters = null;
            return ExecuteStoredProcedure("usp_GetEmployees", parameters, MapEmployee);
        }

        public IEnumerable<EmployeeDetailsDto> GetEmployeesDetails()
        {
            SqlParameter[] parameters = null;
            return ExecuteStoredProcedure("usp_GetEmployeeDetails", parameters, MapEmployeeDetails);
        }

        public IEnumerable<EmployeeDetailsDto> GetEmployeeDetailsByDepartmentID(int departmentID)
        {
            SqlParameter[] parameters = { new SqlParameter("@DepartmentID", departmentID) };
            return ExecuteStoredProcedure("usp_GetEmployeeDetailsByDepartmentID", parameters, MapEmployeeDetails);
        }

        public IEnumerable<EmployeeDetailsDto> GetEmployeeDetailsByDepartmentCode(string departmentCode)
        {
            SqlParameter[] parameters = { new SqlParameter("@DepartmentCode", departmentCode) };
            return ExecuteStoredProcedure("usp_GetEmployeeDetailsByDepartmentCode", parameters, MapEmployeeDetails);
        }

        public Employee AddEmployee(EmployeeDto employeeDto)
        {
            Employee newEmployee = null;

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("usp_AddEmployee", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@FirstName", employeeDto.FirstName);
                        command.Parameters.AddWithValue("@LastName", employeeDto.LastName);
                        command.Parameters.AddWithValue("@EmailAddress", employeeDto.EmailAddress);
                        command.Parameters.AddWithValue("@DateOfBirth", employeeDto.DateOfBirth);
                        command.Parameters.AddWithValue("@Salary", employeeDto.Salary);
                        command.Parameters.AddWithValue("@DepartmentID", employeeDto.DepartmentID);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                Console.Write(reader);
                                newEmployee = new Employee
                                {
                                    EmployeeID = (int)reader["EmployeeID"],
                                    FirstName = reader["FirstName"].ToString(),
                                    LastName = reader["LastName"].ToString(),
                                    EmailAddress = reader["EmailAddress"].ToString(),
                                    DateOfBirth = (DateTime)reader["DateOfBirth"],
                                    Age = (int)reader["Age"],
                                    Salary = (decimal)reader["Salary"],
                                    DepartmentID = (int)reader["DepartmentID"]
                                };
                            }
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                // Handle SQL exceptions
                Console.WriteLine("SQL Error: " + ex.Message);
                throw;
            }

            return newEmployee;
        }

        public Employee UpdateEmployee(int employeeId, EmployeeDto employeeDto)
        {
            Employee updatedEmployee = null;

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("usp_UpdateEmployee", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@EmployeeID", employeeId);
                        command.Parameters.AddWithValue("@FirstName", employeeDto.FirstName);
                        command.Parameters.AddWithValue("@LastName", employeeDto.LastName);
                        command.Parameters.AddWithValue("@EmailAddress", employeeDto.EmailAddress);
                        command.Parameters.AddWithValue("@DateOfBirth", employeeDto.DateOfBirth);
                        command.Parameters.AddWithValue("@Salary", employeeDto.Salary);
                        command.Parameters.AddWithValue("@DepartmentID", employeeDto.DepartmentID);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                updatedEmployee = new Employee
                                {
                                    EmployeeID = (int)reader["EmployeeID"],
                                    FirstName = reader["FirstName"].ToString(),
                                    LastName = reader["LastName"].ToString(),
                                    EmailAddress = reader["EmailAddress"].ToString(),
                                    DateOfBirth = (DateTime)reader["DateOfBirth"],
                                    Age = (int)reader["Age"],
                                    Salary = (decimal)reader["Salary"],
                                    DepartmentID = (int)reader["DepartmentID"]
                                };
                            }
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                // Handle SQL exceptions
                Console.WriteLine("SQL Error: " + ex.Message);
                throw;
            }

            return updatedEmployee;
        }

        public bool DeleteEmployee(int employeeId)
        {
            bool success = false;

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("usp_DeleteEmployee", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@EmployeeID", employeeId);

                        int rowsAffected = command.ExecuteNonQuery();

                        success = rowsAffected > 0;
                    }
                }
            }
            catch (SqlException ex)
            {
                // Handle SQL exceptions
                Console.WriteLine("SQL Error: " + ex.Message);
                throw;
            }

            return success;
        }

    }
}
