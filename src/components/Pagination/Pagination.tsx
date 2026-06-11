import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selected: number) => void;
  currentPage?: number;
}

export default function Pagination({
  pageCount,
  onPageChange,
  currentPage,
}: PaginationProps) {
  return (
    <ul className={css.pagination}>
      {Array.from({ length: pageCount }, (_, index) => {
        const page = index + 1;
        const isActive = currentPage === page;

        return (
          <li
            key={page}
            className={isActive ? css.active : ""}
            onClick={() => onPageChange(page)}
          >
            <a href="#">{page}</a>
          </li>
        );
      })}
    </ul>
  );
}
