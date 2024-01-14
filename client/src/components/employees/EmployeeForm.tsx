import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { EmployeeFormData } from "../../utils/types";
import { createEmployee, updateEmployee } from "../../utils/api";

interface EmployeeFormProps {
  onFormSubmit: () => void;
  initialData?: EmployeeFormData
  method: "POST" | "PUT";
}

const EmployeeFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  emailAddress: z.string().email({
    message: "Invalid email address.",
  }),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  salary: z.string().min(1, {
    message: "Salary is required.",
  }),
  departmentID: z.string().min(1, {
    message: "Department is required.",
  }),
});

export function EmployeeForm({
  onFormSubmit,
  initialData,
  method,
}: EmployeeFormProps) {
  const form = useForm<z.infer<typeof EmployeeFormSchema>>({
    resolver: zodResolver(EmployeeFormSchema),
  });

  useEffect(() => {
    if (initialData) {
        console.log('Initial data:', initialData);
      // Set initial values after form initialization
      Object.entries(initialData).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: z.infer<typeof EmployeeFormSchema>) {
    try {
        const response = await (method === "POST"
          ? createEmployee(data)
          : updateEmployee(Number(initialData?.employeeID) || 0, data));
        console.log(response);
        onFormSubmit();
      }
      catch (error) {
      console.error(`Error ${method === "POST" ? "creating" : "updating"} employee:`, error);
    } finally {
      form.reset();

      console.log("Form submitted:", data);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-1 grid grid-cols-2 gap-2"
      >
        {/* Other form fields */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary</FormLabel>
              <FormControl>
                <Input type="number" placeholder="50000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="departmentID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department ID</FormLabel>
              <FormControl>
                <Input type="number" placeholder="123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="MM/DD/YYYY"
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value
                  }
                  onChange={(e) => {
                    const dateValue = new Date(e.target.value);
                    if (!isNaN(dateValue.getTime())) {
                      field.onChange(dateValue);
                    }
                  }}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
