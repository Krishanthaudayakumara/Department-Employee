import React, { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { CustomDialog } from "../components/CustomDialog";
import { AddDepartmentForm } from "../components/departments/AddDepartmentForm";
import { departmentColumns } from "../components/departments/departmentColumns";
import { fetchDepartmentDetails } from "../utils/api";
import { Department } from "../utils/types";
import toast, { Toaster } from "react-hot-toast";

const DepartmentsPage: React.FC = () => {
  const [departmentData, setDepartmentData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDepartmentDetails();
        setDepartmentData(data);
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
      const data = await fetchDepartmentDetails();
      setDepartmentData(data);
    
    } catch (error: any) {
      setError(error as Error);
      toast.error(`Error reloading department data: ${error.message}`);
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
          data={departmentData}
          columns={departmentColumns({ reloadDataTable })}
          addDialog={
            <CustomDialog
              title="Add Department"
              description="Add New Department Record."
              buttonText="Add Department"
              internalComponents={
                <AddDepartmentForm onFormSubmit={reloadDataTable} />
              }
            />
          }
        />
      </div>
    </div>
  );
};

export default DepartmentsPage;
