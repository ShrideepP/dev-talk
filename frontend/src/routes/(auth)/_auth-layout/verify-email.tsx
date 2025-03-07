import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth-layout/verify-email")({
  component: RouteComponent,
  validateSearch: (search: { email?: string }): { email?: string } => {
    return {
      email: search.email,
    };
  },
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const { email } = Route.useSearch();

  const resendVerificationEmail = async () => {
    try {
      setIsLoading(true);

      await authClient.sendVerificationEmail(
        {
          email: email as string,
          callbackURL: `${window.location.origin}/`,
        },
        {
          onSuccess: () => {
            toast({
              title: "Verify Your Email",
              description:
                "A verification link has been sent to your email address. Please check your inbox to complete registration.",
            });
          },
          onError: (ctx) => {
            toast({
              title: "Oops!",
              description: ctx.error?.message
                ? ctx.error?.message
                : "An error occurred. Please try again later.",
              variant: "destructive",
            });
          },
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify Your Email</CardTitle>

          <CardDescription className="text-balance">
            Verification link sent! Check your email to complete registration.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center gap-4">
          <Button disabled={isLoading} onClick={resendVerificationEmail}>
            {isLoading ? (
              <Icons.loader className="size-4 animate-spin" />
            ) : null}
            {isLoading ? "Just a moment..." : "Resend Email"}
          </Button>

          <Link to="/register">
            <Button variant="outline">Change Email</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
