import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

export const Route = createFileRoute("/(auth)/_auth-layout/forgot-password")({
  component: RouteComponent,
});

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email cannot exceed 255 characters"),
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email } = values;

    try {
      setIsLoading(true);

      await authClient.forgetPassword(
        { email, redirectTo: `${window.location.origin}/reset-password` },
        {
          onSuccess: () => {
            toast({
              title: "Email Sent",
              description:
                "A password reset link has been sent to your email address. Please check your inbox.",
            });
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
      form.reset();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password?</CardTitle>

          <CardDescription className="text-balance">
            Retrieve your password if you've forgotten it.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6">
            <Form {...form}>
              <form
                className="flex flex-col gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="inline-block">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Icons.loader className="size-4 animate-spin" />
                  ) : null}
                  {isLoading ? "Loading..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>

            <p className="text-foreground-500 text-center text-sm font-normal">
              Remember your password?{" "}
              <Link
                to="/login"
                search={{ redirect: "" }}
                className="text-sm leading-none font-medium underline-offset-2 hover:underline"
              >
                Login here
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
