// src/hooks/usePagination.ts

interface UsePaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export const usePagination = ({ totalCount, pageSize, currentPage }: UsePaginationProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
};
