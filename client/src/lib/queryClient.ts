import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Default fetch function for React Query
const defaultQueryFn = async ({ queryKey }: { queryKey: string[] }) => {
  const url = queryKey[0];
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

queryClient.setQueryDefaults(['api'], { queryFn: defaultQueryFn });

// API request function for mutations
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};