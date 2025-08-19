import { useQuery } from '@tanstack/react-query';

// API Configuration
const API_CONFIG = {
  // BASE_URL: "https://toll-tax-server.onrender.com/api",
  BASE_URL: "http://localhost:8000/api",
};

/**
 * A custom hook for fetching data from the API using React Query.
 * It handles loading, error, and data states automatically.
 * @param {string} endpoint - The API endpoint to fetch data from (e.g., '/vehicles').
 * @param {object} options - Additional options for the query.
 * @returns {{ data: any, isLoading: boolean, isError: boolean, error: object | null, refetch: function }}
 */
export const useFetch = (endpoint, options = {}) => {
  const queryKey = ['api', endpoint];
  
  const { 
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        } catch (e) {
          // If parsing JSON fails, throw a generic error with status text
          if (e instanceof SyntaxError) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
          }
          // Re-throw if it's not a JSON parsing error
          throw e;
        }
      }
      return await response.json();
    },
    ...options
  });

  return {
    data,
    loading: isLoading,
    isLoading,
    isError,
    error: isError ? error : null,
    refetch,
    isFetching
  };
};