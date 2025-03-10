import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPasswordSchema } from "@/lib/schema";
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

export const Route = createFileRoute("/(auth)/_auth-layout/reset-password")({
  component: RouteComponent,
  validateSearch: (search: { token?: string }): { token?: string } => {
    return {
      token: search.token,
    };
  },
});

const defaultValues = {
  newPassword: "",
  confirmPassword: "",
};

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { token } = Route.useSearch();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    const { newPassword } = values;

    try {
      setIsLoading(true);

      await authClient.resetPassword(
        { newPassword, token },
        {
          onSuccess: () => {
            toast({
              title: "Success!",
              description:
                "Your password has been updated. You can now log in with your new password.",
            });

            form.reset();
            navigate({ to: "/login" });
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
          <CardTitle className="text-xl">Reset Password</CardTitle>

          <CardDescription className="text-balance">
            Choose a new password for your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-4">
                <FormField
                  name="newPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="inline-block">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your new password"
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
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirm your new password"
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
                {isLoading ? "Loading..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
