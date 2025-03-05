import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "@/lib/schema";
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

export const Route = createFileRoute("/(auth)/_auth-layout/register")({
  component: RouteComponent,
});

const defaultValues = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const { name, username, email, password } = values;

    try {
      setIsLoading(true);

      await authClient.signUp.email(
        {
          name,
          username,
          email,
          password,
          callbackURL: `${window.location.origin}/`,
        },
        {
          onSuccess: (ctx) => {
            navigate({
              to: "/verify-email",
              search: { email: ctx.data.user.email },
            });

            form.reset();
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
          <CardTitle className="text-xl">Create an Account</CardTitle>

          <CardDescription className="text-balance">
            Fill in your information to get started
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
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="inline-block">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter your full name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            placeholder="Choose a unique username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="inline-block">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email address"
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
                        <FormLabel className="inline-block">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Create a strong password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="inline-block">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Re-enter your password"
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
                  {isLoading ? "Processing..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <p className="text-foreground-500 text-center text-sm font-normal">
              Already have an account?{" "}
              <Link
                to="/login"
                search={{ redirect: "" }}
                className="text-sm leading-none font-medium underline-offset-2 hover:underline"
              >
                Log in here
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
