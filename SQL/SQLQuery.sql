-- Create DB
DROP DATABASE IF EXISTS keells;
CREATE DATABASE keells;
USE keells;

DROP FUNCTION IF EXISTS dbo.CalculateAge;


-- calculate age
CREATE FUNCTION dbo.CalculateAge (@DateOfBirth DATE)
RETURNS INT
AS
BEGIN
    RETURN DATEDIFF(YEAR, @DateOfBirth, GETDATE());
END;



DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS Employees;


CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY IDENTITY(1,1),
    DepartmentCode NVARCHAR(50) UNIQUE NOT NULL,
    DepartmentName NVARCHAR(100) NOT NULL
);

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


-- Departments

-- get
CREATE PROCEDURE GetDepartments
AS
BEGIN
    SELECT * FROM Departments;
END;

-- add
CREATE PROCEDURE AddDepartment
    @DepartmentCode NVARCHAR(50),
    @DepartmentName NVARCHAR(100)
AS
BEGIN
    -- Check if the DepartmentCode is unique
    IF EXISTS (SELECT 1 FROM Departments WHERE DepartmentCode = @DepartmentCode)
    BEGIN
        RAISERROR('Department with the same code already exists.', 16, 1);
        RETURN;
    END

    INSERT INTO Departments (DepartmentCode, DepartmentName)
    VALUES (@DepartmentCode, @DepartmentName);
END;


-- Update
CREATE PROCEDURE UpdateDepartment
    @DepartmentID INT,
    @DepartmentCode NVARCHAR(50),
    @DepartmentName NVARCHAR(100)
AS
BEGIN
    -- Check if the DepartmentID exists
    IF NOT EXISTS (SELECT 1 FROM Departments WHERE DepartmentID = @DepartmentID)
    BEGIN
        RAISERROR('Department does not exist.', 16, 1);  
        RETURN;
    END

    -- Check if the new DepartmentCode is unique
    IF EXISTS (SELECT 1 FROM Departments WHERE DepartmentCode = @DepartmentCode AND DepartmentID != @DepartmentID)
    BEGIN
        RAISERROR('Department with the same code already exists.', 16, 1);
        RETURN;
    END

    UPDATE Departments
    SET DepartmentCode = @DepartmentCode,
        DepartmentName = @DepartmentName
    WHERE DepartmentID = @DepartmentID;
END;



-- delete
CREATE PROCEDURE DeleteDepartment
    @DepartmentID INT
AS
BEGIN
    DELETE FROM Departments
    WHERE DepartmentID = @DepartmentID;
END;



-- Employees

-- get
CREATE PROCEDURE GetEmployees
AS
BEGIN
    SELECT * FROM Employees;
END;


-- add
CREATE PROCEDURE AddEmployee
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @EmailAddress NVARCHAR(100),
    @DateOfBirth DATE,
    @Salary DECIMAL(10, 2),
    @DepartmentID INT
AS
BEGIN
    -- Check if the DepartmentID exists
    IF NOT EXISTS (SELECT 1 FROM Departments WHERE DepartmentID = @DepartmentID)
    BEGIN
        RAISERROR('Department does not exist.', 16, 1);  
        RETURN;
    END

    -- Check if the EmailAddress is unique
    IF EXISTS (SELECT 1 FROM Employees WHERE EmailAddress = @EmailAddress)
    BEGIN
        RAISERROR('Employee with the same email address already exists.', 16, 1);
        RETURN;
    END

    INSERT INTO Employees (FirstName, LastName, EmailAddress, DateOfBirth, Salary, DepartmentID)
    VALUES (@FirstName, @LastName, @EmailAddress, @DateOfBirth, @Salary, @DepartmentID);
END;


-- update
CREATE PROCEDURE UpdateEmployee
    @EmployeeID INT,
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @EmailAddress NVARCHAR(100),
    @DateOfBirth DATE,
    @Salary DECIMAL(10, 2),
    @DepartmentID INT
AS
BEGIN
    -- Check if the EmployeeID exists
    IF NOT EXISTS (SELECT 1 FROM Employees WHERE EmployeeID = @EmployeeID)
    BEGIN
        RAISERROR('Employee does not exist.', 16, 1);
        RETURN;
    END

    -- Check if the new EmailAddress is unique
    IF EXISTS (SELECT 1 FROM Employees WHERE EmailAddress = @EmailAddress AND EmployeeID != @EmployeeID)
    BEGIN
        RAISERROR('Employee with the same email address already exists.', 16, 1);
        RETURN;
    END

    -- Check if the DepartmentID exists
    IF NOT EXISTS (SELECT 1 FROM Departments WHERE DepartmentID = @DepartmentID)
    BEGIN
        RAISERROR('Department does not exist.', 16, 1);
        RETURN;
    END

    UPDATE Employees
    SET FirstName = @FirstName,
        LastName = @LastName,
        EmailAddress = @EmailAddress,
        DateOfBirth = @DateOfBirth,
        Salary = @Salary,
        DepartmentID = @DepartmentID
    WHERE EmployeeID = @EmployeeID;
END;


-- delete
CREATE PROCEDURE DeleteEmployee
    @EmployeeID INT
AS
BEGIN
    DELETE FROM Employees
    WHERE EmployeeID = @EmployeeID;
END;


-- use stored procedures
-- Departments
EXEC GetDepartments;

EXEC AddDepartment @DepartmentCode = 'FIN', @DepartmentName = 'Finance';


EXEC UpdateDepartment @DepartmentID = 1, @DepartmentCode = 'MKTG', @DepartmentName = 'Marketing Updated';

EXEC DeleteDepartment @DepartmentID = 2;

-- Employees

EXEC GetEmployees;

EXEC AddEmployee @FirstName = 'Jane', @LastName = 'Doe', @EmailAddress = 'janedoe@example.com', @DateOfBirth = '1995-05-15', @Salary = 60000.00, @DepartmentID = 1;

EXEC UpdateEmployee @EmployeeID = 1, @FirstName = 'John Updated', @LastName = 'Doe Updated', @EmailAddress = 'johnupdated@example.com', @DateOfBirth = '1990-01-25', @Salary = 55000.00, @DepartmentID = 1;

EXEC DeleteEmployee @EmployeeID = 2;
