import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth-layout/login")({
  component: RouteComponent,
  validateSearch: (search: { redirect?: string }): { redirect?: string } => {
    return {
      redirect: search.redirect,
    };
  },
});

const defaultValues = {
  username: "",
  password: "",
};

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { redirect } = Route.useSearch();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { username, password } = values;

    try {
      setIsLoading(true);

      await authClient.signIn.username(
        { username, password },
        {
          onSuccess: () => {
            toast({
              title: "Logged In",
              description: "You have been successfully logged in.",
            });

            form.reset();
            navigate({ to: redirect ?? "/" });
          },
          onError: (ctx) => {
            toast({
              title: "Oops!",
              description:
                ctx.error?.message ??
                "An error occurred. Please try again later.",
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
          <CardTitle className="text-xl">Welcome Back</CardTitle>

          <CardDescription className="text-balance">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6">
            <Form {...form}>
              <form
                className="flex flex-col gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-4">
                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="inline-block">Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter your username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="inline-flex w-full items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link
                            to="/forgot-password"
                            className="text-sm leading-none font-medium underline-offset-2 hover:underline"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Icons.loader className="size-4 animate-spin" />
                  ) : null}
                  {isLoading ? "Just a moment..." : "Log In"}
                </Button>
              </form>
            </Form>

            <p className="text-foreground-500 text-center text-sm font-normal">
              Don't have an account?{" "}
              <Link
                to="/register"
                search={{ redirect: "" }}
                className="text-sm leading-none font-medium underline-offset-2 hover:underline"
              >
                Create Account
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
