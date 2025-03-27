import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { leaderboard } from "@/lib/leaderboard";
import { Fragment } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/layout/footer";

export const Route = createFileRoute("/_main-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex min-h-dvh flex-col justify-between">
      <div>
        <NavigationMenu />

        <div className="w-full p-6 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl gap-6 md:gap-10 lg:grid-cols-3">
            <Outlet />

            <section className="hidden lg:block">
              <Card>
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
                            Ranks are based on posts, replies, likes, and
                            participation.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col gap-2">
                    {leaderboard.map(
                      ({ username, rank, image, name, score }, idx) => (
                        <Fragment key={username}>
                          <div className="flex items-center justify-between">
                            <div className="flex grow items-center gap-4">
                              <span className="text-foreground w-4 text-sm">
                                {rank}.
                              </span>

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

                            <span className="text-foreground text-sm font-medium">
                              {score}
                            </span>
                          </div>

                          {leaderboard.length !== idx + 1 ? (
                            <Separator />
                          ) : null}
                        </Fragment>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
