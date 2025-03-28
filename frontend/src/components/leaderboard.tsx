import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Fragment } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export const Leaderboard = ({
  leaderboard,
}: {
  leaderboard?: LeaderboardUser[];
}) => {
  return (
    <Card className="sticky top-28">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Leaderboard</CardTitle>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Icons.info className="size-4" />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>
                  Ranks are based on posts, replies, likes, and participation.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          {leaderboard?.map(
            ({ id, rank, image, username, name, score }, idx) => (
              <Fragment key={id}>
                <div className="flex items-center justify-between">
                  <div className="flex grow items-center gap-4">
                    <span className="text-foreground w-4 text-sm">{rank}.</span>

                    <Avatar>
                      <AvatarImage
                        src={image ?? undefined}
                        alt={username ?? undefined}
                      />

                      <AvatarFallback>
                        {name.split(" ").map((initial) => initial[0])}
                      </AvatarFallback>
                    </Avatar>

                    <strong className="text-foreground text-sm font-medium">
                      {name}
                    </strong>
                  </div>

                  <span className="text-foreground text-sm">{score}</span>
                </div>

                {leaderboard.length !== idx + 1 ? <Separator /> : null}
              </Fragment>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  );
};
