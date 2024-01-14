import React from "react";
import { AddEmployeeForm } from "../components/employees/AddEmployeeForm";
import { AccordionDemo } from "../components/AccordionDemo";

const DashboardPage = () => {
  return (
    <>

      <div className="flex flex-col justify-center items-center h-screen">

        <div className="flex" >
          <AccordionDemo />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
