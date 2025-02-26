import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { createPostSchema } from "@/lib/schema";
import { AxiosResponse, AxiosError } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCategories, createPost } from "@/lib/queries";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { capitalizeString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_main-layout/create-post")({
  component: RouteComponent,
  validateSearch: (search: {
    contentType?: "text" | "image" | "video" | "link";
  }): {
    contentType?: "text" | "image" | "video" | "link";
  } => {
    return {
      contentType: search.contentType,
    };
  },
});

const defaultValues: z.infer<typeof createPostSchema> = {
  categoryId: "",
  title: "",
  contentType: "text",
  content: undefined,
  file: undefined,
  url: undefined,
};

function RouteComponent() {
  const { contentType = defaultValues.contentType } = Route.useSearch();

  const { data: categoriesRes } = useQuery<QueryResponse<Categories>>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = categoriesRes?.data.categories;

  const { mutate, isPending } = useMutation<
    AxiosResponse<PostCreationResponse>,
    AxiosError<PostCreationResponse>,
    FormData
  >({
    mutationFn: createPost,
  });

  const navigate = useNavigate();

  const { data } = authClient.useSession();

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues,
  });

  const handleContentType = (
    contentType: "text" | "image" | "video" | "link",
  ) => {
    navigate({ to: "/create-post", search: { contentType } });
    form.setValue("contentType", contentType);

    form.setValue("content", undefined);
    form.setValue("file", undefined);
    form.setValue("url", undefined);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      form.setValue("file", event.target.files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof createPostSchema>) => {
    if (!data?.session) {
      navigate({
        to: "/login",
        search: { redirect: window.location.pathname },
      });
    }

    const { categoryId, title, content, contentType, url, file } = values;

    const formData = new FormData();

    if (data?.user.id) formData.append("userId", data?.user.id);
    formData.append("categoryId", categoryId);
    formData.append("title", title);
    if (content) formData.append("content", content);
    formData.append("contentType", contentType);
    if (url) formData.append("url", url);
    if (file) formData.append("file", file);

    mutate(formData, {
      onSuccess: ({ data }) => {
        toast({
          title: capitalizeString(data.status),
          description: data.message,
        });

        navigate({ to: "/" });
      },
      onError: ({ response }) => {
        toast({
          title: capitalizeString(response?.data.status) ?? "Oops!",
          description:
            response?.data.message ??
            "An error occurred. Please try again later.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <section className="col-span-2 flex flex-col gap-6 md:gap-10">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button size="icon" variant="outline">
            <Icons.chevronLeft className="size-4" />
          </Button>
        </Link>

        <div className="leading-none font-semibold tracking-tight">
          Create Post
        </div>
      </div>

      <Tabs defaultValue={contentType}>
        <TabsList className="grid w-fit grid-cols-4">
          <TabsTrigger value="text" onClick={() => handleContentType("text")}>
            Text
          </TabsTrigger>

          <TabsTrigger value="image" onClick={() => handleContentType("image")}>
            Image
          </TabsTrigger>

          <TabsTrigger value="video" onClick={() => handleContentType("video")}>
            Video
          </TabsTrigger>

          <TabsTrigger value="link" onClick={() => handleContentType("link")}>
            Link
          </TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Create a New Post</CardTitle>

            <CardDescription>
              Share your thoughts, ask questions, or start a discussion with the
              community.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                className="flex flex-col gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-4">
                  <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="inline-block">Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter post title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <TabsContent value="text" className="m-0">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="inline-block">
                            Content
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="resize-none"
                              placeholder="Enter your content"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="image" className="m-0">
                    <div className="space-y-2">
                      <Label htmlFor="image" className="inline-block">
                        File
                      </Label>

                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        placeholder="Upload a file"
                        onChange={handleFileChange}
                      />

                      {form.formState.errors.file ? (
                        <FormMessage>
                          {form.formState.errors.file.message}
                        </FormMessage>
                      ) : null}
                    </div>
                  </TabsContent>

                  <TabsContent value="video" className="m-0">
                    <div className="space-y-2">
                      <Label htmlFor="video" className="inline-block">
                        File
                      </Label>

                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        placeholder="Upload a file"
                        onChange={handleFileChange}
                      />

                      {form.formState.errors.file ? (
                        <FormMessage>
                          {form.formState.errors.file.message}
                        </FormMessage>
                      ) : null}
                    </div>
                  </TabsContent>

                  <TabsContent value="link" className="m-0">
                    <FormField
                      name="url"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="inline-block">URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter a valid URL"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <FormField
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="inline-block">Category</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Browse and select a category" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-fit" disabled={isPending}>
                  {isPending ? (
                    <Icons.loader className="size-4 animate-spin" />
                  ) : null}
                  {isPending ? "Loading..." : "Create Post"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Tabs>
    </section>
  );
}
