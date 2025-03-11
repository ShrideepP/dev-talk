import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { reportContent, updateReportStatus, deleteReport } from "@/lib/queries";
import { toast } from "@/hooks/use-toast";
import { capitalizeString } from "@/lib/utils";
import { useSearch } from "@tanstack/react-router";

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

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  const search = useSearch({ from: "/_main-layout/admin" });
  const { page = 1, status } = search;

  return useMutation<
    AxiosResponse<CreationResponse<Report>>,
    AxiosError<CreationResponse<Report>>,
    {
      reportId: string;
      status: "pending" | "reviewed" | "resolved";
    }
  >({
    mutationFn: updateReportStatus,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(
        ["reports", page, status],
        (prevQueryData: QueryResponse<Reports>) => {
          if (!prevQueryData) return prevQueryData;

          return {
            ...prevQueryData,
            data: {
              ...prevQueryData.data,
              reports: prevQueryData.data.reports.map((report) =>
                report.id === data.data.id
                  ? { ...report, status: data.data.status }
                  : report,
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

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  const search = useSearch({ from: "/_main-layout/admin" });
  const { page = 1, status } = search;

  return useMutation<
    AxiosResponse<CreationResponse<Report>>,
    AxiosError<CreationResponse<Report>>,
    string
  >({
    mutationFn: deleteReport,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(
        ["reports", page, status],
        (prevQueryData: QueryResponse<Reports>) => {
          if (!prevQueryData) return prevQueryData;

          return {
            ...prevQueryData,
            data: {
              ...prevQueryData.data,
              reports: prevQueryData.data.reports.filter(
                (report) => report.id !== data.data.id,
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
