import { authClient } from "@/lib/auth-client";
import { useRedirectToLogin } from "@/hooks/use-redirect-to-login";
import { useVoteOnComment } from "@/hooks/use-vote";
import { Card, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Icons } from "./icons";

export const Comment = ({ comment }: { comment: Comment }) => {
  const { data } = authClient.useSession();

  const redirectToLogin = useRedirectToLogin();

  const { mutate, isPending, variables } = useVoteOnComment();

  const isUpvotePending = isPending && variables?.voteType === "upvote";

  const isDownvotePending = isPending && variables?.voteType === "downvote";

  const onVote = (voteType: "upvote" | "downvote") => {
    if (!data?.session) return redirectToLogin();

    mutate({ userId: data.user.id, commentId: comment.id, voteType });
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <Icons.ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <Button variant="ghost" className="w-full">
                <Icons.flag className="size-4" />
                Report Comment
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardTitle>{comment.content}</CardTitle>
      </CardHeader>

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

          <Button variant="outline">
            Reply
            <Icons.reply className="size-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
