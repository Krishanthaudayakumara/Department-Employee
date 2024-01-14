import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/Dashboard";
import EmployeesPage from "./pages/Employees";
import DepartmentsPage from "./pages/Departments";

function App() {
  return (
    <div className="h-full relative">
      <BrowserRouter>
        <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
          <Sidebar />
        </div>
        <main className="md:pl-72">
          <Navbar />
          <Routes>
            <Route path="/dashboard" Component={DashboardPage} />
            <Route path="/employees" Component={EmployeesPage} />
            <Route path="/departments" Component={DepartmentsPage} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
