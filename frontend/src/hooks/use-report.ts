import { useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { reportContent } from "@/lib/queries";
import { toast } from "@/hooks/use-toast";
import { capitalizeString } from "@/lib/utils";

export const useReport = () => {
  return useMutation<
    AxiosResponse<CreationResponse<Report>>,
    AxiosError<CreationResponse<Report>>,
    { [key: string]: string }
  >({
    mutationFn: reportContent,
    onSuccess: ({ data }) => {
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
