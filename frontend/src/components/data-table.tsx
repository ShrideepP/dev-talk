import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "./ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: Pagination;
}

export const DataTable = <TData, TValue>({
  data,
  columns,
  pagination,
}: DataTableProps<TData, TValue>) => {
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="space-x-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!pagination?.hasPrevPage}
            onClick={() =>
              navigate({
                to: "/admin",
                search: (prev) => ({
                  ...prev,
                  page:
                    pagination && pagination.hasPrevPage
                      ? pagination.currentPage - 1
                      : undefined,
                }),
              })
            }
          >
            Previous
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={!pagination?.hasNextPage}
            onClick={() =>
              navigate({
                to: "/admin",
                search: (prev) => ({
                  ...prev,
                  page:
                    pagination && pagination.hasNextPage
                      ? pagination.currentPage + 1
                      : undefined,
                }),
              })
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
