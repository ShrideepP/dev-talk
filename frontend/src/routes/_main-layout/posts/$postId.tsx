import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { createCommentSchema } from "@/lib/schema";
import { authClient } from "@/lib/auth-client";
import { useRedirectToLogin } from "@/hooks/use-redirect-to-login";
import { useQuery } from "@tanstack/react-query";
import { getPost, getComments } from "@/lib/queries";
import { useCreateComment } from "@/hooks/use-comment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { PostSkeleton } from "@/components/post-skeleton";
import { Post } from "@/components/post";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CommentSkeleton } from "@/components/comment-skeleton";
import { Comment } from "@/components/comment";
import { Pagination } from "@/components/pagination";

export const Route = createFileRoute("/_main-layout/posts/$postId")({
  component: RouteComponent,
});

const defaultValues: z.infer<typeof createCommentSchema> = {
  content: "",
};

function RouteComponent() {
  const { postId } = Route.useParams();

  const { data } = authClient.useSession();

  const redirectToLogin = useRedirectToLogin();

  const { data: postRes, isLoading } = useQuery<QueryResponse<Post>>({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
  });

  const { mutate, isPending } = useCreateComment();

  const { data: commentsRes, isLoading: isCommentsLoading } = useQuery<
    QueryResponse<Comments>
  >({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
  });

  const pagination = commentsRes?.data.pagination;

  const form = useForm<z.infer<typeof createCommentSchema>>({
    resolver: zodResolver(createCommentSchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof createCommentSchema>) => {
    if (!data?.session) return redirectToLogin();

    const body: { [key: string]: string } = { ...values };

    if (data?.user.id) body.userId = data?.user.id;
    body.postId = postId;

    mutate(body, {
      onSettled: () => {
        form.reset();
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
          Post Details
        </div>
      </div>

      {isLoading ? <PostSkeleton /> : null}

      {postRes && postRes.data ? (
        <Post post={postRes.data} hideAddCommentBtn />
      ) : null}

      {!postRes?.data && !isLoading ? (
        <Alert>
          <Icons.terminal className="size-4" />
          <AlertTitle>Post Not Found</AlertTitle>
          <AlertDescription>
            The post you’re looking for doesn’t exist or may have been removed.
          </AlertDescription>
        </Alert>
      ) : null}

      {postRes && postRes.data ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
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
                      placeholder="Write a comment..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-fit" disabled={isPending}>
              {isPending ? (
                <Icons.loader className="size-4 animate-spin" />
              ) : null}
              {isPending ? "Just a moment..." : "Post Comment"}
            </Button>
          </form>
        </Form>
      ) : null}

      {isCommentsLoading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <CommentSkeleton key={idx} />
          ))}
        </div>
      ) : null}

      {commentsRes?.data.comments && commentsRes.data.comments.length ? (
        <div className="flex flex-col gap-6">
          {commentsRes.data.comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      ) : null}

      {pagination && pagination.totalItems ? (
        <Pagination pagination={commentsRes.data.pagination} />
      ) : null}
    </section>
  );
}
