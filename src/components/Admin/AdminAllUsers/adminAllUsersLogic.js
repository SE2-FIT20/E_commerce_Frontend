import axios from "axios"

export const handleChangeProductPerPage = (
  productPerPage,
  setProductPerPage,
  setOpenProductPerPageOptions
) => {
  setProductPerPage(productPerPage);
  setOpenProductPerPageOptions(false);
};

export const handleChangeUserType = (
  e,
  currentPage,
  setStockType,
  history
) => {
  setStockType(e.currentTarget.id);
  history.push(`/store/product/${e.currentTarget.id}?pages=${currentPage}`);
};

export const handleClickNext = (setCurrentPage, totalPages) => {
  setCurrentPage((prev) => (prev === totalPages ? prev : prev + 1));
};

export const handleClickPrev = (setCurrentPage) => {
  setCurrentPage((prev) => (prev === 1 ? prev : prev - 1));
};

export const deleteProduct = async ( productToDelete, fetchProducts, setOpenConfirmDelete, BACKEND_URL, config, toast) => {
  try {
    await axios.delete(
      `${BACKEND_URL}/api/store/products/${productToDelete.toString()}`,
      config
    );
    toast({
      title: "Delete product successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
    setOpenConfirmDelete(false);
    fetchProducts();
  } catch (error) {
    toast({
      title: "An error occurred deleting products",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  }
};
