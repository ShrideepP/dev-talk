import React, { Suspense } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Fragment>
      <Outlet />
      <Toaster />
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
      <ReactQueryDevtools position="right" buttonPosition="bottom-left" />
    </Fragment>
  );
}
