import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Fragment>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools position="right" buttonPosition="bottom-left" />
    </Fragment>
  );
}
