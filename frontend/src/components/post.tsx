import { authClient } from "@/lib/auth-client";
import { useRedirectToLogin } from "@/hooks/use-redirect-to-login";
import { useVoteOnPost } from "@/hooks/use-vote";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { TiptapStaticRenderer } from "./tiptap-static-renderer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "@tanstack/react-router";

export const Post = ({
  post,
  hideAddCommentBtn = false,
}: {
  post: Post;
  hideAddCommentBtn?: boolean;
}) => {
  const { data } = authClient.useSession();

  const redirectToLogin = useRedirectToLogin();

  const { mutate, isPending, variables } = useVoteOnPost();

  const isUpvotePending = isPending && variables?.voteType === "upvote";

  const isDownvotePending = isPending && variables?.voteType === "downvote";

  const onVote = (voteType: "upvote" | "downvote") => {
    if (!data?.session) return redirectToLogin();

    mutate({ userId: data.user.id, postId: post.id, voteType });
  };

  return (
    <Card>
      <CardHeader>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={post.image ?? undefined}
                alt={post.username ?? undefined}
              />

              <AvatarFallback>
                {post.name.split(" ").map((initial) => initial[0])}
              </AvatarFallback>
            </Avatar>

            <strong className="text-foreground text-sm font-medium">
              {post.name}
            </strong>
          </div>

          {data?.user.id === post.userId ? null : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Icons.ellipsis className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <Button variant="ghost" className="w-full">
                  <Icons.flag className="size-4" />
                  Report Post
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <CardTitle>{post.title}</CardTitle>

        {post.contentType === "text" || post.contentType === "link" ? (
          post.contentType === "text" ? (
            <TiptapStaticRenderer content={post.content ?? ""} />
          ) : (
            <CardDescription>
              <a
                target="_blank"
                href={post.url ?? undefined}
                className="underline underline-offset-2"
              >
                {post.url}
              </a>
            </CardDescription>
          )
        ) : null}
      </CardHeader>

      {post.contentType === "image" || post.contentType === "video" ? (
        <CardContent>
          {post.contentType === "image" ? (
            <AspectRatio
              ratio={16 / 9}
              className="relative overflow-hidden rounded-xl"
            >
              <img
                src={post.mediaUrl ?? undefined}
                alt={`Image by @${post.username}`}
                className="absolute inset-0 object-cover object-center"
              />
            </AspectRatio>
          ) : (
            <AspectRatio
              ratio={16 / 9}
              className="relative overflow-hidden rounded-xl"
            >
              <video
                controls
                className="absolute inset-0"
                src={post.mediaUrl ?? undefined}
              >
                Video
              </video>
            </AspectRatio>
          )}
        </CardContent>
      ) : null}

      <CardFooter>
        <div className="flex w-full justify-between">
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
                {post.upvotes - post.downvotes}
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

          {hideAddCommentBtn ? null : (
            <Link to="/posts/$postId" params={{ postId: post.id }}>
              <Button size="icon" variant="outline">
                <Icons.messageCircle className="size-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
