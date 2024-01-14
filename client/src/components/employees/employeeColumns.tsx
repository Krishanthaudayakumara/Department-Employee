// employeeColumns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Employee } from "../../utils/types";
import { ChevronDownIcon } from "lucide-react";
import { CustomDialog } from "../CustomDialog";
import { EmployeeForm } from "./EmployeeForm";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { deleteEmployee } from "../../utils/api";

interface EmployeeColumnsProps {
  reloadDataTable: () => Promise<void>;
}

export const employeeColumns = ({
  reloadDataTable,
}: EmployeeColumnsProps): ColumnDef<Employee>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "emailAddress",
    header: "Email Address",
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) => {
      const formattedDate = new Date(
        row.getValue("dateOfBirth")
      ).toLocaleDateString();
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "salary",
    header: "Salary",
  },
  {
    accessorKey: "departmentCode",
    header: "Department Code",
  },
  {
    accessorKey: "departmentName",
    header: "Department Name",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <CustomDialog
          title="Edit Employee"
          description="Edit employee details"
          buttonText="Edit"
          internalComponents={
            <EmployeeForm
              onFormSubmit={reloadDataTable}
              method="PUT"
              initialData={{
                employeeID: row.original.employeeID,
                firstName: row.original.firstName || "",
                lastName: row.original.lastName || "",
                emailAddress: row.original.emailAddress || "",
                dateOfBirth: new Date(row.original.dateOfBirth) || new Date(),
                salary: row.original.salary.toString() || "",
                departmentID: row.original.departmentID.toString() || "",
              }}
            />
          }
        />
        <DeleteAlertDialog
          reloadDataTable={reloadDataTable}
          onDelete={() => handleDelete(row.original.employeeID)}
        />
      </div>
    ),
  },
];

// Function to handle edit button click
const handleEdit = (employeeID: number) => {
  // Implement your edit logic here
  console.log(`Edit employee with ID: ${employeeID}`);
};

// Function to handle delete button click
const handleDelete = async (employeeID: number) => {
  let result = await deleteEmployee(employeeID);
  console.log(`Delete employee with ID: ${employeeID} and result ${result}` );
  return result;
};
