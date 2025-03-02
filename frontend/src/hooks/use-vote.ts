import { useLocation } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { vote } from "@/lib/queries";
import { toast } from "@/hooks/use-toast";
import { capitalizeString } from "@/lib/utils";

export const useVoteOnPost = () => {
  const {
    pathname,
    search: { page = 1, category, newest },
  } = useLocation();

  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CreationResponse<Post>>,
    AxiosError<CreationResponse<Post>>,
    { [key: string]: string }
  >({
    mutationFn: vote,
    onSuccess: ({ data }) => {
      const postId = pathname.split("/")[pathname.split("/").length - 1];

      if (postId) {
        queryClient.setQueryData(
          ["post", postId],
          (prevQueryData: QueryResponse<Post>) => {
            if (!prevQueryData) return prevQueryData;

            return {
              ...prevQueryData,
              data: {
                ...prevQueryData.data,
                upvotes: data.data.upvotes,
                downvotes: data.data.downvotes,
              },
            };
          },
        );
      } else {
        queryClient.setQueryData(
          ["posts", page, category, newest],
          (prevQueryData: QueryResponse<Posts>) => {
            if (!prevQueryData) return prevQueryData;

            return {
              ...prevQueryData,
              data: {
                ...prevQueryData.data,
                posts: prevQueryData.data.posts.map((post) =>
                  post.id === data.data.id
                    ? {
                        ...post,
                        upvotes: data.data.upvotes,
                        downvotes: data.data.downvotes,
                      }
                    : post,
                ),
              },
            };
          },
        );
      }

      toast({
        title: capitalizeString(data.status),
        description: data.message,
      });
    },
    onError: ({ response }) => {
      toast({
        title: capitalizeString(response?.data.status) ?? "Oops!",
        description:
          response?.data.message ??
          "An error occurred. Please try again later.",
        variant: "destructive",
      });
    },
  });
};

export const useVoteOnComment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CreationResponse<Comment>>,
    AxiosError<CreationResponse<Comment>>,
    { [key: string]: string }
  >({
    mutationFn: vote,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(
        ["comments", data.data.postId],
        (prevQueryData: QueryResponse<Comments>) => {
          if (!prevQueryData) return prevQueryData;

          return {
            ...prevQueryData,
            data: {
              ...prevQueryData.data,
              comments: prevQueryData.data.comments.map((comment) =>
                comment.id === data.data.id
                  ? {
                      ...comment,
                      upvotes: data.data.upvotes,
                      downvotes: data.data.downvotes,
                    }
                  : comment,
              ),
            },
          };
        },
      );

      toast({
        title: capitalizeString(data.status),
        description: data.message,
      });
    },
    onError: ({ response }) => {
      toast({
        title: capitalizeString(response?.data.status) ?? "Oops!",
        description:
          response?.data.message ??
          "An error occurred. Please try again later.",
        variant: "destructive",
      });
    },
  });
};
