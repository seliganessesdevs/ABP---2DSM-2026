import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AppRouterProvider } from "./router";

export function AppProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterProvider />
    </QueryClientProvider>
  );
}