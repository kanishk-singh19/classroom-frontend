import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBack, useList } from "@refinedev/core";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { subjectSchema } from "@/lib/schema";
import { Department } from "@/types";

const SubjectsCreate = () => {
  const back = useBack();

  // Load departments from the database so the dropdown stays in sync.
  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 100 },
  });
  const departments = departmentsQuery.data?.data ?? [];

  const form = useForm({
    resolver: zodResolver(subjectSchema),
    refineCoreProps: {
      resource: "subjects",
      action: "create",
    },
    defaultValues: {
      name: "",
      code: "",
      description: "",
      department: "",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const onSubmit = async (values: z.infer<typeof subjectSchema>) => {
    await onFinish(values);
  };

  return (
    <CreateView>
      <Breadcrumb />

      <h1 className="page-title">Create a Subject</h1>

      <div className="intro-row">
        <p>Provide the required information below to add a subject.</p>
        <Button type="button" onClick={() => back()}>
          Go Back
        </Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Fill out form</CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subject Name <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Programming" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Code + Department */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Code <span className="text-orange-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="CS101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Department <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem
                                key={department.id}
                                value={department.name}
                              >
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description about the subject"
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
                      Creating Subject...
                      <Loader2 className="animate-spin h-4 w-4" />
                    </div>
                  ) : (
                    "Create Subject"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default SubjectsCreate;
