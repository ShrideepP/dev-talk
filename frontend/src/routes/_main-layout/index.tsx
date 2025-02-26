import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getPosts } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Categories } from "@/components/categories";
import { Icons } from "@/components/icons";
import { PostSkeleton } from "@/components/post-skeleton";
import { Post } from "@/components/post";
import { Pagination } from "@/components/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/_main-layout/")({
  component: RouteComponent,
  validateSearch: (search: {
    page?: number;
    category?: string;
  }): { page?: number; category?: string } => {
    return {
      page: search.page,
      category: search.category,
    };
  },
});

function RouteComponent() {
  const { page = 1, category } = Route.useSearch();

  const { data: categoriesRes } = useQuery<QueryResponse<Categories>>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: postsRes, isLoading } = useQuery<QueryResponse<Posts>>({
    queryKey: ["posts", page, category],
    queryFn: () => getPosts(page, category),
  });

  const pagination = postsRes?.data.pagination;

  return (
    <section className="col-span-2 flex flex-col gap-6 md:gap-10">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex grow gap-2">
          <Button variant="outline">Newest</Button>
          <Categories categories={categoriesRes?.data.categories} />
        </div>

        <Link to="/create-post">
          <Button>
            <Icons.plus className="size-4" /> Create Post
          </Button>
        </Link>
      </div>

      {isLoading
        ? Array.from({ length: 10 }).map((_, idx) => <PostSkeleton key={idx} />)
        : null}

      {postsRes?.data.posts && postsRes.data.posts.length ? (
        <div className="flex flex-col gap-6">
          {postsRes.data.posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : null}

      {pagination && pagination.totalItems ? (
        <Pagination pagination={postsRes.data.pagination} />
      ) : null}

      {pagination && !pagination.totalItems ? (
        <Alert>
          <Icons.terminal className="size-4" />
          <AlertTitle>No Posts Found</AlertTitle>
          <AlertDescription>
            Try adjusting your filters or check back later for new posts.
          </AlertDescription>
        </Alert>
      ) : null}
    </section>
  );
}
