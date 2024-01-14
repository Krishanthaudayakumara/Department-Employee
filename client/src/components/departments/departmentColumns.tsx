import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Department } from "../../utils/types";
import { CustomDialog } from "../CustomDialog";
import { DepartmentForm } from "./DepartmentForm";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { deleteDepartment } from "../../utils/api";

interface DepartmentColumnsProps {
  reloadDataTable: () => Promise<void>;
}

export const departmentColumns = ({
  reloadDataTable,
}: DepartmentColumnsProps): ColumnDef<Department>[] => [
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
          title="Edit Department"
          description="Edit department details"
          buttonText="Edit"
          internalComponents={
            <DepartmentForm
              onFormSubmit={reloadDataTable}
              method="PUT"
              initialData={{
                departmentID: row.original.departmentID,
                departmentCode: row.original.departmentCode || "",
                departmentName: row.original.departmentName || "",
              }}
            />
          }
        />
        <DeleteAlertDialog
          reloadDataTable={reloadDataTable}
          onDelete={() => handleDelete(row.original.departmentID!)}
        />
      </div>
    ),
  },
];

const handleDelete = async (departmentID: number) => {
  let result = await deleteDepartment(departmentID);
  console.log(`Delete department with ID: ${departmentID} and result ${result}`);
  return result;
};
