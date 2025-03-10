import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Link } from "@tanstack/react-router";
import { Icons } from "@/components/icons";

export const Route = createFileRoute("/(auth)/_auth-layout")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (session) throw redirect({ to: ".." });
  },
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <Icons.galleryVerticalEnd className="size-4" />
          </div>
          DevTalk
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
