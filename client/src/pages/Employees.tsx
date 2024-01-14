import React, { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { fetchEmployeeDetails } from "../utils/api";
import { employeeColumns } from "../components/employees/employeeColumns";
import { AddEmployeeForm } from "../components/employees/AddEmployeeForm";
import { CustomDialog } from "../components/CustomDialog";
import { Button } from "../components/ui/button";
import { Employee } from "../utils/types";

const EmployeesPage: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEmployeeDetails();
        setEmployeeData(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const reloadDataTable = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployeeDetails();
      setEmployeeData(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="container mx-auto py-10">
        <DataTable
          data={employeeData}
          columns={employeeColumns({ reloadDataTable })}
          addDialog={
            <CustomDialog
              title="Add Employee"
              description="Add New Employee Record."
              buttonText="Add Employee"
              internalComponents={
                <AddEmployeeForm onFormSubmit={reloadDataTable} />
              }
            />
          }
        />
      </div>
    </div>
  );
};

export default EmployeesPage;
