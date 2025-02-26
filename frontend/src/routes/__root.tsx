import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Fragment>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </Fragment>
  );
}
