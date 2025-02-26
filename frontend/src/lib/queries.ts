import axios, { AxiosResponse } from "axios";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const getCategories = async () => {
  const res = await axios.get(`${BASE_API_URL}/api/v1/categories`);
  return res.data;
};

export const getPosts = async (page: number, category?: string) => {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", "10");
  if (category) params.set("category", category);

  const res = await axios.get(
    `${BASE_API_URL}/api/v1/posts?${params.toString()}`,
  );
  return res.data;
};

export const createPost = async (
  body: FormData,
): Promise<AxiosResponse<PostCreationResponse>> => {
  const res = await axios.post(`${BASE_API_URL}/api/v1/posts`, body, {
    withCredentials: true,
  });
  return res;
};
