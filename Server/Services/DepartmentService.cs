using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Server.DTOs;
using Server.Interface;
using Server.Models;

namespace Server.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly string _connectionString;

        public DepartmentService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IEnumerable<Department> GetDepartments()
        {
            List<Department> departments = new List<Department>();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("usp_GetDepartments", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Department department = new Department
                                {
                                    DepartmentID = (int)reader["DepartmentID"],
                                    DepartmentCode = reader["DepartmentCode"] != DBNull.Value ? reader["DepartmentCode"].ToString() : null,
                                    DepartmentName = reader["DepartmentName"] != DBNull.Value ? reader["DepartmentName"].ToString() : null
                                };

                                departments.Add(department);
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

            return departments;
        }

        public Department AddDepartment(DepartmentDto departmentDto)
        {
            Department newDepartment = null;

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("usp_AddDepartment", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@DepartmentCode", departmentDto.DepartmentCode);
                        command.Parameters.AddWithValue("@DepartmentName", departmentDto.DepartmentName);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                newDepartment = new Department
                                {
                                    DepartmentID = (int)reader["DepartmentID"],
                                    DepartmentCode = reader["DepartmentCode"] != DBNull.Value ? reader["DepartmentCode"].ToString() : null,
                                    DepartmentName = reader["DepartmentName"] != DBNull.Value ? reader["DepartmentName"].ToString() : null  
                                };

                                Console.WriteLine(reader);
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
            Console.WriteLine(newDepartment);
            return newDepartment;
        }

        public Department UpdateDepartment(int departmentId, DepartmentDto departmentDto)
        {
            Department updatedDepartment = null;

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("usp_UpdateDepartment", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@DepartmentID", departmentId);
                        command.Parameters.AddWithValue("@DepartmentCode", departmentDto.DepartmentCode);
                        command.Parameters.AddWithValue("@DepartmentName", departmentDto.DepartmentName);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                updatedDepartment = new Department
                                {
                                    DepartmentID = (int)reader["DepartmentID"],
                                    DepartmentCode = reader["DepartmentCode"] != DBNull.Value ? reader["DepartmentCode"].ToString() : null,
                                    DepartmentName = reader["DepartmentName"] != DBNull.Value ? reader["DepartmentName"].ToString() : null
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

            return updatedDepartment;
        }


        public bool DeleteDepartment(int departmentID)
        {
            bool success = false;

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("usp_DeleteDepartment", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@DepartmentID", departmentID);

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