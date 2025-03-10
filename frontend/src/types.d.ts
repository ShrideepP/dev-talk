interface QueryResponse<DataType> {
  status: "success" | "error";
  message: string;
  data: DataType;
  error: Error[];
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

type PaginatedResults<T, K extends string> = {
  pagination: Pagination;
} & {
  [P in K]: T[];
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

type Categories = PaginatedResults<Category, "categories">;

interface Post {
  id: string;
  userId: string;
  name: string;
  image?: string;
  username?: string;
  categoryId: string;
  title: string;
  content: string | null;
  contentType: "text" | "image" | "video" | "link";
  url: string | null;
  mediaUrl: string | null;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
}

type Posts = PaginatedResults<Post, "posts">;

interface CreationResponse<DataType> {
  status: "success" | "error";
  message: string;
  data: DataType;
  error: unknown[];
}

interface Comment {
  id: string;
  userId: string;
  name: string;
  image?: string;
  username?: string;
  postId: string;
  parentId: string | null;
  replyCount: number;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

type Comments = PaginatedResults<Comment, "comments">;

interface Reply extends Comment {}

type Replies = PaginatedResults<Reply, "replies">;

interface Report {
  id: string;
  userId: string;
  reportedBy: string;
  postId?: string;
  commentId?: string;
  reason: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: Date;
}

type Reports = PaginatedResults<Report, "reports">;
