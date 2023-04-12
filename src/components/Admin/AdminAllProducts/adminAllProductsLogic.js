export const handleClickNext = (setCurrentPage, totalPages) => {
  setCurrentPage((prev) => (prev === totalPages ? prev : prev + 1));
};

export const handleClickPrev = (setCurrentPage) => {
  setCurrentPage((prev) => (prev === 1 ? prev : prev - 1));
};

export const handleChangeProductPerPage = (
  productPerPage,
  setProductPerPage,
  setOpenProductPerPageOptions
) => {
  setProductPerPage(productPerPage);
  setOpenProductPerPageOptions(false);
};