import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useReportActions } from "@/hooks/use-report";
import { useDeletePost } from "@/hooks/use-create-post";
import { useDeleteComment } from "@/hooks/use-comment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { Fragment } from "react";
import { Form, FormField, FormControl, FormItem, FormLabel } from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const formSchema = z.object({
  status: z.enum(["pending", "reviewed", "resolved"], {
    message: "Please select a valid status",
  }),
});

export const ReportActions = ({ report }: { report: Report }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { updateStatusMutation, deleteContentMutation } = useReportActions();

  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost();

  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteComment();

  const statuses = formSchema.shape.status.options;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateStatusMutation.mutate(
      { reportId: report.id, ...values },
      {
        onSettled: () => {
          form.reset();
          setOpen(false);
        },
      },
    );
  };

  const removeContent = () => {
    if (report.postId) deletePost(report.postId);
    else if (report.commentId) deleteComment(report.commentId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <Icons.ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  to: "/posts/$postId",
                  params: { postId: report.postId ?? "" },
                })
              }
            >
              <Icons.eye className="size-4" /> View Content
            </DropdownMenuItem>

            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Icons.pencil className="size-4" />
                Update Status
              </DropdownMenuItem>
            </DialogTrigger>

            <DropdownMenuItem
              onClick={() => deleteContentMutation.mutate(report.id)}
            >
              {deleteContentMutation.isPending ? (
                <Fragment>
                  <Icons.loader className="size-4 animate-spin" />
                  Loading...
                </Fragment>
              ) : (
                <Fragment>
                  <Icons.trash className="size-4" />
                  Dismiss Report
                </Fragment>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={removeContent}>
              {isDeletingPost || isDeletingComment ? (
                <Fragment>
                  <Icons.loader className="size-4 animate-spin" />
                  Loading...
                </Fragment>
              ) : (
                <Fragment>
                  <Icons.triangleAlert className="size-4" /> Remove Content
                </Fragment>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Report Status</DialogTitle>
          <DialogDescription>
            Change the status of this report to keep track of its moderation
            progress.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    {statuses.map((reason) => (
                      <FormItem
                        key={reason}
                        className="flex items-center space-y-0 space-x-2"
                      >
                        <FormControl>
                          <RadioGroupItem value={reason} />
                        </FormControl>
                        <FormLabel className="capitalize">{reason}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />

            <Button
              type="submit"
              className="w-fit"
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <Icons.loader className="size-4 animate-spin" />
              ) : null}
              {updateStatusMutation.isPending ? "Loading..." : "Update Status"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
