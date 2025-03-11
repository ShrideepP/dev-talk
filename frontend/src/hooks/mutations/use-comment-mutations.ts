import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { createComment, deleteComment } from "@/lib/queries";
import { toast } from "@/hooks/use-toast";
import { capitalizeString } from "@/lib/utils";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CreationResponse<Comment>>,
    AxiosError<CreationResponse<Comment>>,
    { [key: string]: string }
  >({
    mutationFn: createComment,
    onSuccess: ({ data }) => {
      // queryClient.setQueryData(
      //   ["comments", data.data.postId],
      //   (prevQueryData: QueryResponse<Comments>) => {
      //     if (!prevQueryData) return prevQueryData;

      //     return {
      //       ...prevQueryData,
      //       data: {
      //         ...prevQueryData.data,
      //         comments: [...prevQueryData.data.comments, { ...data.data }],
      //       },
      //     };
      //   },
      // );

      queryClient.invalidateQueries({
        queryKey: ["comments", data.data.postId],
      });

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

export const useReplyComment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CreationResponse<Comment>>,
    AxiosError<CreationResponse<Comment>>,
    { [key: string]: string }
  >({
    mutationFn: createComment,
    onSuccess: ({ data }) => {
      // queryClient.setQueryData(
      //   ["replies", data.data.parentId],
      //   (prevQueryData: QueryResponse<Replies>) => {
      //     if (!prevQueryData) return prevQueryData;

      //     return {
      //       ...prevQueryData,
      //       data: {
      //         ...prevQueryData.data,
      //         replies: [...prevQueryData.data.replies, { ...data.data }],
      //       },
      //     };
      //   },
      // );

      queryClient.invalidateQueries({
        queryKey: ["replies", data.data.parentId],
      });

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

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CreationResponse<Comment>>,
    AxiosError<CreationResponse<Comment>>,
    string
  >({
    mutationFn: deleteComment,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });

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
