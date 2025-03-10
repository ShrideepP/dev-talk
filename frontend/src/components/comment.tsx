import { z } from "zod";
import { createReplySchema } from "@/lib/schema";
import { authClient } from "@/lib/auth-client";
import { useRedirectToLogin } from "@/hooks/use-redirect-to-login";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getReplies } from "@/lib/queries";
import { useVoteOnComment } from "@/hooks/use-vote";
import { useReplyComment } from "@/hooks/use-comment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { ReportContent } from "./report-content";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import { Reply } from "./reply";

const defaultValues: z.infer<typeof createReplySchema> = {
  content: "",
};

export const Comment = ({ comment }: { comment: Comment }) => {
  const { data } = authClient.useSession();

  const redirectToLogin = useRedirectToLogin();

  const [open, setOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [shouldFetchReplies, setShouldFetchReplies] = useState(false);

  const {
    data: repliesRes,
    isLoading,
    refetch,
  } = useQuery<QueryResponse<Replies>>({
    queryKey: ["replies", comment.id],
    queryFn: () => getReplies(comment.id),
    enabled: false,
    retry: 1,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, variables } = useVoteOnComment();

  const isUpvotePending = isPending && variables?.voteType === "upvote";

  const isDownvotePending = isPending && variables?.voteType === "downvote";

  const replyCommentMutation = useReplyComment();

  const onToggleReplies = () => {
    if (shouldFetchReplies) {
      queryClient.removeQueries({
        queryKey: ["replies", comment.id],
      });

      setShouldFetchReplies(false);
    } else {
      refetch();
      setShouldFetchReplies(true);
    }
  };

  const onVote = (voteType: "upvote" | "downvote") => {
    if (!data?.session) return redirectToLogin();

    mutate({ userId: data.user.id, commentId: comment.id, voteType });
  };

  const form = useForm<z.infer<typeof createReplySchema>>({
    resolver: zodResolver(createReplySchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof createReplySchema>) => {
    if (!data?.session) return redirectToLogin();

    const body: { [key: string]: string } = { ...values };

    if (data?.user.id) body.userId = data?.user.id;
    body.postId = comment.postId;
    body.parentId = comment.id;

    replyCommentMutation.mutate(body, {
      onSettled: () => {
        form.reset();
        setIsReplying(false);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={comment.image ?? undefined}
                alt={comment.username ?? undefined}
              />

              <AvatarFallback>
                {comment.name.split(" ").map((initial) => initial[0])}
              </AvatarFallback>
            </Avatar>

            <strong className="text-foreground text-sm font-medium">
              {comment.name}
            </strong>
          </div>

          {data?.user.id === comment.userId ? null : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Icons.ellipsis className="size-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full">
                      <Icons.triangleAlert className="size-4" />
                      Report Comment
                    </Button>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              <ReportContent
                userId={data?.user.id}
                commentId={comment.id}
                setOpen={setOpen}
              />
            </Dialog>
          )}
        </div>

        <CardTitle>{comment.content}</CardTitle>
      </CardHeader>

      <CardFooter className="flex flex-col gap-6">
        <div className="flex w-full justify-between">
          <div className="flex gap-2">
            <div className="flex">
              <Button
                size="icon"
                variant="outline"
                disabled={isUpvotePending}
                onClick={() => onVote("upvote")}
              >
                {isUpvotePending ? (
                  <Icons.loader className="size-4 animate-spin" />
                ) : (
                  <Icons.chevronUp className="size-4" />
                )}
              </Button>

              <div className="grid size-9 place-items-center">
                <span className="text-foreground text-sm font-normal">
                  {comment.upvotes - comment.downvotes}
                </span>
              </div>

              <Button
                size="icon"
                variant="outline"
                disabled={isDownvotePending}
                onClick={() => onVote("downvote")}
              >
                {isDownvotePending ? (
                  <Icons.loader className="size-4 animate-spin" />
                ) : (
                  <Icons.chevronDown className="size-4" />
                )}
              </Button>
            </div>

            {comment.replyCount ? (
              <Button variant="ghost" onClick={onToggleReplies}>
                {isLoading ? (
                  <Icons.loader className="size-4 animate-spin" />
                ) : null}

                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    View Replies
                    <Icons.chevronDown
                      className={`size-4 ${shouldFetchReplies ? "rotate-180" : "rotate-0"}`}
                    />
                  </>
                )}
              </Button>
            ) : null}
          </div>

          <Button variant="outline" onClick={() => setIsReplying(true)}>
            Reply
            <Icons.reply className="size-4" />
          </Button>
        </div>

        {isReplying ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-6"
            >
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none"
                        placeholder="Write a reply..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  className="w-fit"
                  variant="outline"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="w-fit"
                  disabled={replyCommentMutation.isPending}
                >
                  {replyCommentMutation.isPending ? (
                    <Icons.loader className="size-4 animate-spin" />
                  ) : null}
                  {replyCommentMutation.isPending ? "Loading..." : "Reply"}
                </Button>
              </div>
            </form>
          </Form>
        ) : null}

        {repliesRes?.data.replies && repliesRes.data.replies.length ? (
          <div className="flex w-full flex-col gap-6">
            {repliesRes.data.replies.map((reply) => (
              <Reply key={reply.id} reply={reply} />
            ))}
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};
