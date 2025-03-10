import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/lib/queries";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";

export const Route = createFileRoute("/_main-layout/admin")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session || session.user.role !== "admin") throw redirect({ to: ".." });
  },
  validateSearch: (search: {
    page?: number;
    status?: "pending" | "reviewed" | "resolved";
  }): { page?: number; status?: "pending" | "reviewed" | "resolved" } => {
    return {
      page: search.page,
      status: search.status,
    };
  },
});

function RouteComponent() {
  const { page = 1, status } = Route.useSearch();

  const { data } = useQuery<QueryResponse<Reports>>({
    queryKey: ["reports", page, status],
    queryFn: () => getReports(page, status),
  });

  return (
    <section className="col-span-2">
      <DataTable
        columns={columns}
        data={data?.data.reports ?? []}
        pagination={data?.data.pagination}
      />
    </section>
  );
}
