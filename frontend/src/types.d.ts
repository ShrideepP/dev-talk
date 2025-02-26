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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

interface Categories {
  // pagination: Pagination;
  categories: Category[];
}

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

interface Posts {
  pagination: Pagination;
  posts: Post[];
}

interface PostCreationResponse {
  status: "success" | "error";
  message: string;
  data: Post;
  error: unknown[];
}
