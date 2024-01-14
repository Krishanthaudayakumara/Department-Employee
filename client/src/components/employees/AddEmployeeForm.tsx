import { EmployeeForm } from "./EmployeeForm";

export function AddEmployeeForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  return (
    <EmployeeForm
      onFormSubmit={onFormSubmit}
      method="POST"
    />
  );
}
