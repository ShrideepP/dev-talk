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

export const vote = async <DataType>(body: {
  [key: string]: string;
}): Promise<AxiosResponse<CreationResponse<DataType>>> => {
  const res = await axios.post(`${BASE_API_URL}/api/v1/votes`, body, {
    withCredentials: true,
  });
  return res;
};
