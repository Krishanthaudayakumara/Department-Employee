import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import * as z from "zod";
import { useEffect } from "react";
import { Department } from "../../utils/types";
import { createDepartment, updateDepartment } from "../../utils/api";
import toast from "react-hot-toast";

interface DepartmentFormProps {
  onFormSubmit: () => void;
  initialData?: Department;
  method: "POST" | "PUT";
}

const DepartmentFormSchema = z.object({
  departmentCode: z.string().min(2, {
    message: "Department code must be at least 2 characters.",
  }),
  departmentName: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
});

export function DepartmentForm({
  onFormSubmit,
  initialData,
  method,
}: DepartmentFormProps) {
  const form = useForm<z.infer<typeof DepartmentFormSchema>>({
    resolver: zodResolver(DepartmentFormSchema),
  });

  useEffect(() => {
    if (initialData) {
      console.log('Initial data:', initialData);
      Object.entries(initialData).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: z.infer<typeof DepartmentFormSchema>) {
    try {
      const response = await (method === "POST"
        ? createDepartment(data)
        : updateDepartment(Number(initialData?.departmentID) || 0, data));
      console.log(response);
      toast.success(`Department ${method === "POST" ? "added" : "updated"} successfully`);

      onFormSubmit();

      form.reset();

    } catch (error: any) {
      console.error(`Error ${method === "POST" ? "creating" : "updating"} department:`, error);
      toast.error(`Error ${method === "POST" ? "creating" : "updating"} department: ${error.response.data.error}`);

    } finally {
      console.log("Form submitted:", data);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-1 grid grid-cols-2 gap-2"
      >
        <FormField
          control={form.control}
          name="departmentCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Code</FormLabel>
              <FormControl>
                <Input placeholder="MKTG" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="departmentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Name</FormLabel>
              <FormControl>
                <Input placeholder="Marketing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
