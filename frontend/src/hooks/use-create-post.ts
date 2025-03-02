import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { createPost } from "@/lib/queries";
import { toast } from "@/hooks/use-toast";
import { capitalizeString } from "@/lib/utils";

export const useCreatePost = () => {
  const navigate = useNavigate();

  return useMutation<
    AxiosResponse<CreationResponse<Post>>,
    AxiosError<CreationResponse<Post>>,
    FormData
  >({
    mutationFn: createPost,
    onSuccess: ({ data }) => {
      toast({
        title: capitalizeString(data.status),
        description: data.message,
      });

      navigate({ to: ".." });
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
