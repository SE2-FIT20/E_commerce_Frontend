import axios from "axios"

export const handleChangeUserPerPage = (
  userPerPage,
  setUserPerPage,
  setOpenUserPerPageOptions
) => {
  setUserPerPage(userPerPage);
  setOpenUserPerPageOptions(false);
};

export const handleChangeUserType = (
  e,
  currentPage,
  setUserType,
  history
) => {
  setUserType(e.currentTarget.id);
  history.push(`/admin/users/${e.currentTarget.id}?page=${currentPage}`);
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
