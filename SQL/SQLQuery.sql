DROP FUNCTION dbo.CalculateAge;


-- Declare the function first (if not already created)
CREATE FUNCTION dbo.CalculateAge (@DateOfBirth DATE)
RETURNS INT
AS
BEGIN
    RETURN DATEDIFF(YEAR, @DateOfBirth, GETDATE());
END;

-- Create the tables after the function declaration
DROP DATABASE IF EXISTS keells;
CREATE DATABASE keells;
USE keells;

DROP TABLE IF EXISTS Departments;

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
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

-- sample values added
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
    INSERT INTO Departments (DepartmentCode, DepartmentName)
    VALUES (@DepartmentCode, @DepartmentName);
END;

-- update
CREATE PROCEDURE UpdateDepartment
    @DepartmentID INT,
    @DepartmentCode NVARCHAR(50),
    @DepartmentName NVARCHAR(100)
AS
BEGIN
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

EXEC UpdateEmployee @EmployeeID = 4, @FirstName = 'John Updated', @LastName = 'Doe Updated', @EmailAddress = 'johnupdated@example.com', @DateOfBirth = '1990-01-25', @Salary = 55000.00, @DepartmentID = 1;

EXEC DeleteEmployee @EmployeeID = 5;
