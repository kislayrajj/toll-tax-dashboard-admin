// Filename: src/hooks/useSubmit.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/apiService";

/**
 * A custom hook for submitting data (POST, PATCH, DELETE) using React Query.
 */
export const useSubmit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ endpoint, method = "post", body }) => {
      const apiMethod = apiService[method.toLowerCase()];
      if (!apiMethod) {
        throw new Error(`Invalid API method: ${method}`);
      }
      return apiMethod(endpoint, body);
    },
    onSuccess: () => {
      // After a successful mutation, invalidate the disputes query to refetch the list
      const queryKeyToInvalidate = [
        "api",
        `/${variables.endpoint.split("/")[1]}`,
      ];
      queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
    },
  });
};
