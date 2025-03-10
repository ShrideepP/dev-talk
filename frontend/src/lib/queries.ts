import axios, { AxiosResponse } from "axios";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const getCategories = async () => {
  const res = await axios.get(`${BASE_API_URL}/api/v1/categories`);
  return res.data;
};

export const getPosts = async (
  page: number,
  category?: string,
  newest?: boolean,
) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", "10");
  if (category) params.append("category", category);
  if (newest) params.append("newest", String(newest));

  const res = await axios.get(
    `${BASE_API_URL}/api/v1/posts?${params.toString()}`,
  );
  return res.data;
};

export const getPost = async (postId: string) => {
  const res = await axios.get(`${BASE_API_URL}/api/v1/posts/${postId}`);
  return res.data;
};

export const createPost = async (
  body: FormData,
): Promise<AxiosResponse<CreationResponse<Post>>> => {
  const res = await axios.post(`${BASE_API_URL}/api/v1/posts`, body, {
    withCredentials: true,
  });
  return res;
};

export const deletePost = async (
  postId: string,
): Promise<AxiosResponse<CreationResponse<Post>>> => {
  const res = await axios.delete(`${BASE_API_URL}/api/v1/posts/${postId}`, {
    withCredentials: true,
  });
  return res;
};

export const createComment = async (body: {
  [key: string]: string;
}): Promise<AxiosResponse<CreationResponse<Comment>>> => {
  const res = await axios.post(`${BASE_API_URL}/api/v1/comments`, body, {
    withCredentials: true,
  });
  return res;
};

export const getComments = async (postId: string) => {
  const res = await axios.get(`${BASE_API_URL}/api/v1/comments/${postId}`);
  return res.data;
};

export const getReplies = async (commentId: string) => {
  const res = await axios.get(
    `${BASE_API_URL}/api/v1/comments/${commentId}/replies`,
  );
  return res.data;
};

export const deleteComment = async (
  commentId: string,
): Promise<AxiosResponse<CreationResponse<Comment>>> => {
  const res = await axios.delete(
    `${BASE_API_URL}/api/v1/comments/${commentId}`,
  );
  return res.data;
};

export const vote = async <T>(body: {
  [key: string]: string;
}): Promise<AxiosResponse<CreationResponse<T>>> => {
  const res = await axios.post(`${BASE_API_URL}/api/v1/votes`, body, {
    withCredentials: true,
  });
  return res;
};

export const reportContent = async (body: {
  [key: string]: string;
}): Promise<AxiosResponse<CreationResponse<Report>>> => {
  const res = await axios.post(`${BASE_API_URL}/api/v1/reports`, body, {
    withCredentials: true,
  });
  return res;
};

export const getReports = async (
  page: number,
  status?: "pending" | "reviewed" | "resolved",
) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", "10");
  if (status) params.append("status", status);

  const res = await axios.get(
    `${BASE_API_URL}/api/v1/reports?${params.toString()}`,
    { withCredentials: true },
  );
  return res.data;
};

export const updateReportStatus = async ({
  reportId,
  status,
}: {
  reportId: string;
  status: "pending" | "reviewed" | "resolved";
}) => {
  const res = await axios.patch(
    `${BASE_API_URL}/api/v1/reports/${reportId}`,
    { status },
    { withCredentials: true },
  );
  return res;
};

export const deleteReport = async (
  reportId: string,
): Promise<AxiosResponse<CreationResponse<Report>>> => {
  const res = await axios.delete(`${BASE_API_URL}/api/v1/reports/${reportId}`, {
    withCredentials: true,
  });
  return res;
};
