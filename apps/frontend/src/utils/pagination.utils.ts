export const getTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
}

export const getPageRange = (page: number, limit: number): { skip: number; take: number } => {
  return { skip: (page - 1) * limit, take: limit };
}

export const hasNextPage = (page: number, total: number, limit: number): boolean => {
  return page < getTotalPages(total, limit);
}