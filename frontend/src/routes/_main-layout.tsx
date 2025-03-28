import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/lib/queries";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Leaderboard } from "@/components/leaderboard";
import { Footer } from "@/components/layout/footer";

export const Route = createFileRoute("/_main-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: leaderboardRes } = useQuery<QueryResponse<Leaderboard>>({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });

  return (
    <main className="flex min-h-dvh flex-col justify-between">
      <div>
        <NavigationMenu />

        <div className="w-full p-6 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl gap-6 md:gap-10 lg:grid-cols-3">
            <Outlet />

            <section className="hidden lg:block">
              <Leaderboard leaderboard={leaderboardRes?.data.leaderboard} />
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
