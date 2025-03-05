import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Link } from "@tanstack/react-router";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Fragment } from "react";

export const NavigationMenu = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data } = authClient.useSession();

  const logOut = async () => {
    setIsLoading(true);

    try {
      await authClient.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-background sticky top-0 z-50 w-full px-6 py-4 md:px-10">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <Icons.galleryVerticalEnd className="size-4" />
          </div>
          DevTalk
        </Link>

        <div className="flex items-center gap-2">
          {data?.session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={data.user.image ?? undefined}
                    alt={data.user.username ?? undefined}
                  />

                  <AvatarFallback>
                    {data.user.name.split(" ").map((initial) => initial[0])}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <Button variant="ghost" className="w-full" onClick={logOut}>
                  {isLoading ? (
                    <Icons.loader className="size-4 animate-spin" />
                  ) : (
                    <Icons.logOut className="size-4" />
                  )}
                  {isLoading ? "Processing..." : "Log Out"}
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Fragment>
              <Link to="/login" search={{ redirect: window.location.pathname }}>
                <Button variant="outline">Log In</Button>
              </Link>

              <Link to="/register">
                <Button>Create Account</Button>
              </Link>
            </Fragment>
          )}
        </div>
      </nav>
    </header>
  );
};
