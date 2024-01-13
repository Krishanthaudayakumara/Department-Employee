-- Create DB
DROP DATABASE IF EXISTS keells;
CREATE DATABASE keells;
USE keells;

DROP FUNCTION IF EXISTS dbo.CalculateAge;


-- calculate age
GO
CREATE FUNCTION dbo.CalculateAge (@DateOfBirth DATE)
    RETURNS INT
    AS
    BEGIN
        RETURN DATEDIFF(YEAR, @DateOfBirth, GETDATE());
    END;
GO


-- Departments
DROP TABLE IF EXISTS Departments;

CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY IDENTITY(1,1),
    DepartmentCode NVARCHAR(50) UNIQUE NOT NULL,
    DepartmentName NVARCHAR(100) NOT NULL
);

-- Employees
DROP TABLE IF EXISTS Employees;

CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    EmailAddress NVARCHAR(100) UNIQUE NOT NULL,
    DateOfBirth DATE NOT NULL,
	Age AS dbo.CalculateAge(DateOfBirth),
    Salary DECIMAL(10, 2) NOT NULL,
    DepartmentID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID) ON DELETE CASCADE
);

-- sample values adding
INSERT INTO Departments (DepartmentCode, DepartmentName)
VALUES ('MKTG', 'Marketing');


INSERT INTO Employees (FirstName, LastName, EmailAddress, DateOfBirth, Salary, DepartmentID)
VALUES ('John', 'Doe', 'johndoe@example.com', '1990-01-25', 50000.00, 1);


-- Stored procedures
-- Departments

-- get
GO
CREATE PROCEDURE usp_GetDepartments
    AS
    BEGIN
        SELECT * FROM Departments;
    END;
GO


-- Get Department by ID
CREATE PROCEDURE usp_GetDepartmentByID
    @DepartmentID INT
AS
BEGIN
    SELECT *
    FROM Departments
    WHERE DepartmentID = @DepartmentID;
END;
GO

-- add
CREATE PROCEDURE usp_AddDepartment
    @DepartmentCode NVARCHAR(50),
    @DepartmentName NVARCHAR(100)
    AS
    BEGIN
        BEGIN TRANSACTION;
        BEGIN TRY
            -- Check if the DepartmentCode is unique
            IF EXISTS (SELECT 1 FROM Departments WHERE DepartmentCode = @DepartmentCode)
            BEGIN;
                THROW 50001, 'Department with the same code already exists.', 1;
            END
            
            DECLARE @NewDepartmentID INT;

            INSERT INTO Departments (DepartmentCode, DepartmentName)
            VALUES (@DepartmentCode, @DepartmentName);

            SET @NewDepartmentID = SCOPE_IDENTITY();

            COMMIT;

            EXEC usp_GetDepartmentByID @DepartmentID = @NewDepartmentID;
        END TRY
        BEGIN CATCH
            ROLLBACK;
            THROW;
        END CATCH
    END;
GO

-- update
CREATE PROCEDURE usp_UpdateDepartment
    @DepartmentID INT,
    @DepartmentCode NVARCHAR(50),
    @DepartmentName NVARCHAR(100)
    AS
    BEGIN
        BEGIN TRANSACTION;
        BEGIN TRY
            -- Check if the DepartmentID exists
            IF NOT EXISTS (SELECT 1 FROM Departments WHERE DepartmentID = @DepartmentID)
            BEGIN;
                THROW 50002, 'Department does not exist.', 1;  
            END

            -- Check if the new DepartmentCode is unique
            IF EXISTS (SELECT 1 FROM Departments WHERE DepartmentCode = @DepartmentCode AND DepartmentID != @DepartmentID)
            BEGIN;
                THROW 50001, 'Department with the same code already exists.', 1;
            END

            UPDATE Departments
            SET DepartmentCode = @DepartmentCode,
                DepartmentName = @DepartmentName
            WHERE DepartmentID = @DepartmentID;

            COMMIT;

            EXEC usp_GetDepartmentByID @DepartmentID = @DepartmentID;

        END TRY
        BEGIN CATCH
            ROLLBACK;
            THROW;
        END CATCH
    END;
GO

-- delete
CREATE PROCEDURE usp_DeleteDepartment
    @DepartmentID INT
    AS
    BEGIN
        BEGIN TRANSACTION;
        BEGIN TRY
            DELETE FROM Departments
            WHERE DepartmentID = @DepartmentID;

            COMMIT;
        END TRY
        BEGIN CATCH
            ROLLBACK;
            THROW;
        END CATCH
    END;
GO


-- Employees
-- Create a view to get employee details with department details
DROP VIEW vw_EmployeeDetails;

CREATE VIEW vw_EmployeeDetails AS
SELECT
    E.EmployeeID,
    E.FirstName,
    E.LastName,
    E.EmailAddress,
    E.DateOfBirth,
    E.Age,
    E.Salary,
    E.DepartmentID,
    D.DepartmentCode,
    D.DepartmentName
FROM
    Employees E
JOIN
    Departments D ON E.DepartmentID = D.DepartmentID;
GO

-- get
CREATE PROCEDURE usp_GetEmployees
    AS
    BEGIN
        SELECT * FROM Employees;
    END;
GO

CREATE PROCEDURE usp_GetEmployeeDetails
AS
BEGIN
    SELECT * FROM vw_EmployeeDetails;
END;
GO

CREATE PROCEDURE usp_GetEmployeeDetailsByDepartmentID
    @DepartmentID INT
AS
BEGIN
    SELECT *
    FROM vw_EmployeeDetails
    WHERE DepartmentID = @DepartmentID;
END;
GO

CREATE PROCEDURE usp_GetEmployeeDetailsByDepartmentCode
    @DepartmentCode NVARCHAR(50)
AS
BEGIN
    SELECT *
    FROM vw_EmployeeDetails
    WHERE DepartmentCode = @DepartmentCode;
END;
GO


-- get by ID
CREATE PROCEDURE usp_GetEmployeeByID
    @EmployeeID INT
AS
BEGIN
    SELECT
        EmployeeID,
        FirstName,
        LastName,
        EmailAddress,
        DateOfBirth,
        Age,
        Salary,
        DepartmentID
    FROM
        Employees
    WHERE
        EmployeeID = @EmployeeID;
END;
GO

-- add
CREATE PROCEDURE usp_AddEmployee
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @EmailAddress NVARCHAR(100),
    @DateOfBirth DATE,
    @Salary DECIMAL(10, 2),
    @DepartmentID INT
    AS
    BEGIN
        BEGIN TRANSACTION;
        BEGIN TRY
            -- Check if the DepartmentID exists
            IF NOT EXISTS (SELECT 1 FROM Departments WHERE DepartmentID = @DepartmentID)
            BEGIN;
                THROW 50002, 'Department does not exist.', 1;  
            END

            -- Check if the EmailAddress is unique
            IF EXISTS (SELECT 1 FROM Employees WHERE EmailAddress = @EmailAddress)
            BEGIN;
                THROW 50003, 'Employee with the same email address already exists.', 1;
            END

            DECLARE @NewEmployeeID INT; 

            INSERT INTO Employees (FirstName, LastName, EmailAddress, DateOfBirth, Salary, DepartmentID)
            VALUES (@FirstName, @LastName, @EmailAddress, @DateOfBirth, @Salary, @DepartmentID);
            
            SET @NewEmployeeID = SCOPE_IDENTITY(); 
            
            COMMIT;

            EXEC usp_GetEmployeeByID @EmployeeID = @NewEmployeeID;
        END TRY
        BEGIN CATCH
            ROLLBACK;
            THROW;
        END CATCH
    END;
GO

-- update
CREATE PROCEDURE usp_UpdateEmployee
    @EmployeeID INT,
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @EmailAddress NVARCHAR(100),
    @DateOfBirth DATE,
    @Salary DECIMAL(10, 2),
    @DepartmentID INT
    AS
    BEGIN
        BEGIN TRANSACTION;
        BEGIN TRY
            -- Check if the EmployeeID exists
            IF NOT EXISTS (SELECT 1 FROM Employees WHERE EmployeeID = @EmployeeID)
            BEGIN;
                THROW 50004, 'Employee does not exist.', 1;
            END

            -- Check if the new EmailAddress is unique
            IF EXISTS (SELECT 1 FROM Employees WHERE EmailAddress = @EmailAddress AND EmployeeID != @EmployeeID)
            BEGIN;
                THROW 50003, 'Employee with the same email address already exists.', 1;
            END

            -- Check if the DepartmentID exists
            IF NOT EXISTS (SELECT 1 FROM Departments WHERE DepartmentID = @DepartmentID)
            BEGIN;
                THROW 50002, 'Department does not exist.', 1;
            END

            UPDATE Employees
            SET FirstName = @FirstName,
                LastName = @LastName,
                EmailAddress = @EmailAddress,
                DateOfBirth = @DateOfBirth,
                Salary = @Salary,
                DepartmentID = @DepartmentID
            WHERE EmployeeID = @EmployeeID;

            COMMIT;

            EXEC usp_GetEmployeeByID @EmployeeID = @EmployeeID;

        END TRY
        BEGIN CATCH
            ROLLBACK;
            THROW;
        END CATCH
    END;
GO

-- delete
CREATE PROCEDURE usp_DeleteEmployee
    @EmployeeID INT
    AS
    BEGIN
        BEGIN TRANSACTION;
        BEGIN TRY
            DELETE FROM Employees
            WHERE EmployeeID = @EmployeeID;

            COMMIT;
        END TRY
        BEGIN CATCH
            ROLLBACK;
            THROW;
        END CATCH
    END;
GO


-- Testing

-- Departments
EXEC usp_GetDepartments;

-- Adding a new department
EXEC usp_AddDepartment @DepartmentCode = 'HR', @DepartmentName = 'Human Resources';

-- Updating an existing department
EXEC usp_UpdateDepartment @DepartmentID = 1, @DepartmentCode = 'MKTG', @DepartmentName = 'Marketing Updated';

-- Trying to add a department with the same code (error scenario)
BEGIN TRY
    EXEC usp_AddDepartment @DepartmentCode = 'MKTG', @DepartmentName = 'Marketing Duplicate';
END TRY
BEGIN CATCH
    PRINT 'Error: ' + ERROR_MESSAGE();
END CATCH

-- Deleting a department
EXEC usp_DeleteDepartment @DepartmentID = 2;

-- Trying to update a non-existing department (error scenario)
BEGIN TRY
    EXEC usp_UpdateDepartment @DepartmentID = 5, @DepartmentCode = 'IT', @DepartmentName = 'IT Updated';
END TRY
BEGIN CATCH
    PRINT 'Error: ' + ERROR_MESSAGE();
END CATCH

-- Employees
EXEC usp_GetEmployees;

-- Adding a new employee
EXEC usp_AddEmployee @FirstName = 'Alice', @LastName = 'Wonder', @EmailAddress = 'alicewonsder@example.com', @DateOfBirth = '1992-03-18', @Salary = 70000.00, @DepartmentID = 1;

-- Updating an existing employee
EXEC usp_UpdateEmployee @EmployeeID = 1, @FirstName = 'John Updated', @LastName = 'Doe Updated', @EmailAddress = 'johnupdated@example.com', @DateOfBirth = '1990-01-25', @Salary = 55000.00, @DepartmentID = 3;

-- Trying to add an employee with the same email address (error scenario)
BEGIN TRY
    EXEC usp_AddEmployee @FirstName = 'Bob', @LastName = 'Smith', @EmailAddress = 'alicewonder@example.com', @DateOfBirth = '1993-07-12', @Salary = 60000.00, @DepartmentID = 2;
END TRY
BEGIN CATCH
    PRINT 'Error: ' + ERROR_MESSAGE();
END CATCH

-- Deleting an employee
EXEC usp_DeleteEmployee @EmployeeID = 2;

-- Trying to update a non-existing employee (error scenario)
BEGIN TRY
    EXEC usp_UpdateEmployee @EmployeeID = 5, @FirstName = 'Jane', @LastName = 'Doe', @EmailAddress = 'janedoe@example.com', @DateOfBirth = '1995-05-15', @Salary = 60000.00, @DepartmentID = 1;
END TRY
BEGIN CATCH
    PRINT 'Error: ' + ERROR_MESSAGE();
END CATCH

-- Retrieve employee details
EXEC usp_GetEmployeeDetails;

-- Retrieve employee details by Department ID
EXEC usp_GetEmployeeDetailsByDepartmentID @DepartmentID = 1;

-- Retrieve employee details by Department Code
EXEC usp_GetEmployeeDetailsByDepartmentCode @DepartmentCode = 'HR';


