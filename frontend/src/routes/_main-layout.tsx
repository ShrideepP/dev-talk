import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/footer";

export const Route = createFileRoute("/_main-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex min-h-dvh flex-col justify-between">
      <div>
        <NavigationMenu />

        <div className="w-full p-6 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl gap-6 md:gap-10 lg:grid-cols-3">
            <Outlet />
            <section className="rounded-xl p-6 md:p-10"></section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
