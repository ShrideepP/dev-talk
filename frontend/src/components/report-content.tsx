import { useRedirectToLogin } from "@/hooks/use-redirect-to-login";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { reportPostSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReport } from "@/hooks/use-report";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Form, FormField, FormControl, FormItem, FormLabel } from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { Icons } from "./icons";

export const ReportContent = ({
  userId,
  postId,
  commentId,
  setOpen,
}: {
  userId?: string;
  postId?: string;
  commentId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const redirectToLogin = useRedirectToLogin();

  const reportReasons = reportPostSchema.shape.reason.options;

  const form = useForm<z.infer<typeof reportPostSchema>>({
    resolver: zodResolver(reportPostSchema),
  });

  const { mutate, isPending } = useReport();

  const onSubmit = (values: z.infer<typeof reportPostSchema>) => {
    if (!userId) return redirectToLogin();

    const body: { [key: string]: string } = { ...values };

    body.userId = userId;
    if (postId) body.postId = postId;
    if (commentId) body.commentId = commentId;

    mutate(body, {
      onSettled: () => {
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Report Content</DialogTitle>
        <DialogDescription>
          Tell us why you're reporting this content, and our team will review
          it.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            name="reason"
            control={form.control}
            render={({ field }) => (
              <FormControl>
                <RadioGroup
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  {reportReasons.map((reason) => (
                    <FormItem
                      key={reason}
                      className="flex items-center space-y-0 space-x-2"
                    >
                      <FormControl>
                        <RadioGroupItem value={reason} />
                      </FormControl>
                      <FormLabel>{reason}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />

          <Button type="submit" className="w-fit" disabled={isPending}>
            {isPending ? (
              <Icons.loader className="size-4 animate-spin" />
            ) : null}
            {isPending ? "Just a moment..." : "Submit Report"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};
