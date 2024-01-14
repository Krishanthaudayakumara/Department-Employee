export type Employee = {
  employeeID: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth: string;
  age: number;
  salary: number;
  departmentID: number;
  departmentCode: string;
  departmentName: string;
};

export type EmployeeFormData = {
  employeeID?: Number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth: Date;
  salary: string;
  departmentID: string;
};

export type Department = {
  departmentID?: number;
  departmentCode: string;
  departmentName: string;
};
