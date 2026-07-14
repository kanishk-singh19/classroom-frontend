import { useEffect } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBack } from "@refinedev/core";
import { Loader2 } from "lucide-react";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { EditView } from "@/components/refine-ui/views/edit-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { departmentSchema } from "@/lib/schema";
import { Department } from "@/types";

const DepartmentsEdit = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(departmentSchema),
    refineCoreProps: { resource: "departments", action: "edit" },
    defaultValues: { code: "", name: "", description: "" },
  });

  const {
    refineCore: { onFinish, query },
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = form;

  const record = query?.data?.data as Department | undefined;

  useEffect(() => {
    if (!record) return;
    reset({
      code: record.code ?? "",
      name: record.name ?? "",
      description: record.description ?? "",
    });
  }, [record, reset]);

  const onSubmit = async (values: z.infer<typeof departmentSchema>) => {
    await onFinish(values);
  };

  return (
    <EditView>
      <Breadcrumb />

      <h1 className="page-title">Edit Department</h1>

      <div className="intro-row">
        <p>Update the department details.</p>
        <Button type="button" onClick={() => back()}>
          Go Back
        </Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit form</CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField
                    control={control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Code <span className="text-orange-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="CS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="sm:col-span-2">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Name <span className="text-orange-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Computer Science" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What this department covers"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button type="submit" size="lg" className="w-full">
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      Saving...
                      <Loader2 className="animate-spin h-4 w-4" />
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </EditView>
  );
};

export default DepartmentsEdit;
