import { useCallback, useState } from "react";

export interface UsePaginationReturn {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

function normalizePositiveInt(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.floor(value));
}

export function usePagination(
  initialPage = 1,
  initialLimit = 10,
): UsePaginationReturn {
  const [page, setPageState] = useState<number>(
    normalizePositiveInt(initialPage, 1),
  );
  const [limit, setLimitState] = useState<number>(
    normalizePositiveInt(initialLimit, 10),
  );

  const setPage = useCallback((nextPage: number) => {
    setPageState((currentPage) => normalizePositiveInt(nextPage, currentPage));
  }, []);

  const setLimit = useCallback((nextLimit: number) => {
    setLimitState((currentLimit) => normalizePositiveInt(nextLimit, currentLimit));
  }, []);

  const nextPage = useCallback(() => {
    setPageState((prevPage) => prevPage + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPageState((prevPage) => Math.max(1, prevPage - 1));
  }, []);

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
  };
}
