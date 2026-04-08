import React from "react";
import PaginationButtons from "../PaginationButtons/PaginationButtons";
import { IPaginationProps } from "../../model/types";

interface Props {
  children: React.ReactNode;
  top?: boolean;
  bottom?: boolean;
}

const Pagination = ({
  top,
  bottom,
  children,
  ...paginationProps
}: Props & IPaginationProps) => {
  const shouldShowPagination = paginationProps.totalPages > 1;

  return (
    <>
      {top && shouldShowPagination && <PaginationButtons {...paginationProps} />}
      {children}
      {bottom && shouldShowPagination && <PaginationButtons {...paginationProps} />}
    </>
  );
};

export default Pagination;