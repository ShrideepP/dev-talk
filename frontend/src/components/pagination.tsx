import {
  Pagination as PageNavigation,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { Link } from "@tanstack/react-router";

export const Pagination = ({ pagination }: { pagination: Pagination }) => {
  const { hasPrevPage, currentPage, totalPages, hasNextPage } = pagination;

  const pageNumbers = Array.from({ length: totalPages }, (_, idx) => idx + 1);
  const maxPagesToShow = 3;

  let startIdx = Math.max(0, currentPage - 2);
  let endIdx = Math.min(startIdx + maxPagesToShow, totalPages);

  if (endIdx - startIdx < maxPagesToShow && startIdx > 0) {
    startIdx = Math.max(0, endIdx - maxPagesToShow);
  }

  const visiblePages = pageNumbers.slice(startIdx, endIdx);

  return (
    <PageNavigation className="justify-start">
      <PaginationContent>
        <PaginationItem>
          <Link
            to="/"
            disabled={!hasPrevPage}
            search={(prev) => ({
              ...prev,
              page: hasPrevPage ? currentPage - 1 : undefined,
            })}
          >
            <PaginationPrevious />
          </Link>
        </PaginationItem>

        {startIdx > 0 && (
          <>
            <PaginationItem>
              <Link to="/" search={(prev) => ({ ...prev, page: 1 })}>
                <PaginationLink>1</PaginationLink>
              </Link>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {visiblePages.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <Link
              to="/"
              disabled={currentPage === pageNum}
              search={(prev) => ({ ...prev, page: pageNum })}
            >
              <PaginationLink isActive={currentPage === pageNum}>
                {pageNum}
              </PaginationLink>
            </Link>
          </PaginationItem>
        ))}

        {endIdx < totalPages && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <Link to="/" search={(prev) => ({ ...prev, page: totalPages })}>
                <PaginationLink>{totalPages}</PaginationLink>
              </Link>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <Link
            to="/"
            disabled={!hasNextPage}
            search={(prev) => ({
              ...prev,
              page: hasNextPage ? currentPage + 1 : undefined,
            })}
          >
            <PaginationNext />
          </Link>
        </PaginationItem>
      </PaginationContent>
    </PageNavigation>
  );
};
