import React from "react";
import PaginationButtons from "../PaginationButtons/PaginationButtons";
import { IPaginationProps } from "../../model/types";

interface Props {
  children: React.ReactNode;
  top?: boolean;
  bottom?: boolean;
}

const Pagination = ({
  bottom,
  children,
  ...paginationProps
}: Props & IPaginationProps) => {
  return (
    <>
      {children}
      {bottom && <PaginationButtons {...paginationProps} />}
    </>
  );
};

export default Pagination;