import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AppRouterProvider } from "./router";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export function AppProvider() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppRouterProvider />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}