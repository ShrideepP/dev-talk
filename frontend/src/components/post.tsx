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
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const Post = ({ post }: { post: Post }) => {
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <Icons.ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <Button variant="ghost" className="w-full">
                <Icons.triangleAlert className="size-4" />
                Report Post
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardTitle>{post.title}</CardTitle>

        {post.contentType === "text" || post.contentType === "link" ? (
          <CardDescription>
            {post.contentType === "text" ? (
              post.content
            ) : (
              <a
                target="_blank"
                href={post.url ?? undefined}
                className="underline underline-offset-2"
              >
                {post.url}
              </a>
            )}
          </CardDescription>
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
            <Button size="icon" variant="outline">
              <Icons.arrowUp className="size-4" />
            </Button>

            <div className="grid size-9 place-items-center">
              <span className="text-foreground text-sm font-normal">0</span>
            </div>

            <Button size="icon" variant="outline">
              <Icons.arrowDown className="size-4" />
            </Button>
          </div>

          <Button size="icon" variant="outline">
            <Icons.messageCircle className="size-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
