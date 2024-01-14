import React from "react";
import { DepartmentForm } from "./DepartmentForm";

export function AddDepartmentForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  return <DepartmentForm onFormSubmit={onFormSubmit} method="POST" />;
}
