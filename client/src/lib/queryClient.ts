import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  urlOrOptions: string | RequestInfo,
  options?: RequestInit | string,
  data?: unknown,
): Promise<any> {
  // Handle both styles of calling:
  // 1. apiRequest('/api/endpoint', { method: 'POST', ... })
  // 2. apiRequest('POST', '/api/endpoint', data)
  
  let url: string;
  let requestOptions: RequestInit;
  
  if (typeof urlOrOptions === 'string' && typeof options === 'object') {
    // Style 1: apiRequest('/api/endpoint', { method: 'POST', ... })
    url = urlOrOptions;
    requestOptions = options;
  } else if (typeof urlOrOptions === 'string' && typeof options === 'string') {
    // Style 2: apiRequest('POST', '/api/endpoint', data)
    const method = urlOrOptions;
    url = options;
    requestOptions = {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
    };
  } else {
    throw new Error('Invalid arguments to apiRequest');
  }
  
  // Ensure credentials are included
  requestOptions.credentials = "include";
  
  const res = await fetch(url, requestOptions);
  await throwIfResNotOk(res);
  
  // Try to parse as JSON if possible
  try {
    return await res.json();
  } catch (e) {
    return res;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
