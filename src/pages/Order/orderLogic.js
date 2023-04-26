import axios from "axios";

export const handleChangeOrderPerPage = (
  orderPerPage,
  setOrderPerPage,
  setOpenOrderPerPageOptions,
  setCurrentPage
) => {
  setOrderPerPage(orderPerPage);
  setOpenOrderPerPageOptions(false);
  setCurrentPage(1);
};

export const handleClickNext = (setCurrentPage, totalPages) => {
  if (totalPages === 0) return;
  setCurrentPage((prev) => (prev === totalPages ? prev : prev + 1));
};

export const handleClickPrev = (setCurrentPage, totalPages) => {
  if (totalPages === 0) return;

  setCurrentPage((prev) => (prev === 1 ? prev : prev - 1));
};

export const handleDisplayOrderType = (orderType) => {
  switch (orderType) {
    case "ALL":
      return "ALL";
    case "PENDING":
      return "PENDING";
    case "READY_FOR_DELIVERY":
      return "READY";
    case "DELIVERING":
      return "DELIVERING";
    case "DELIVERED":
      return "DELIVERED";
    case "CANCELLED_BY_CUSTOMER":
      return "CANCELLED";
    case "CANCELLED_BY_STORE":
      return "CANCELLED";
    default:
      return "";
  }
};

export const handleConvertOrderType = (orderType) => {
  switch (orderType) {
    case "all":
      return "ALL";
    case "pending":
      return "PENDING";
    case "ready":
      return "READY_FOR_DELIVERY";
    case "delivering":
      return "DELIVERING";
    case "delivered":
      return "DELIVERED";
    case "cancelled":
      return "CANCELLED";
  }
};

export const handleDisplayFilterOption = (option) => {
  switch (option) {
    case "name":
      return "Name";
    case "price":
      return "Price";
    case "quantity":
      return "Quantity";
    case "createdAt":
      return "Date";
  }
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  return formattedDate.replace(/\d+/, day + suffix);
};

export const getOrdinalSuffix = (day) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = day % 100;
  const suffix =
    suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
  return suffix;
};

export const handleDisplayStatus = (status) => {
  switch (status) {
    case "PENDING":
      return "PENDING";
    case "READY_FOR_DELIVERY":
      return "READY";
    case "DELIVERING":
      return "Delivering";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "";
  }
};

export const handleDisplayStatusButton = (status) => {
  switch (status) {
    case "PENDING":
      return "Prepare Order";
    case "READY_FOR_DELIVERY":
      return "Unprepare Order";
    case "DELIVERING":
      return "Delivering";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "";
  }
};

export const handleOrder = async (
  orderType,
  orderId,
  fetchOrders,
  BACKEND_URL,
  config,
  toast
) => {
  if (orderType === "prepare-order") {
    try {
      await axios.put(
        `${BACKEND_URL}/api/store/orders`,
        {
          orderId,
          status: "READY_FOR_DELIVERY",
        },
        config
      );
      toast({
        title: "Prepare order successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: "An error occurred preparing orders",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  } else if (orderType === "unprepare-order") {
    try {
      await axios.put(
        `${BACKEND_URL}/api/store/orders`,
        {
          orderId,
          status: "PENDING",
        },
        config
      );
      toast({
        title: "Unprepare order successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: "An error occurred unpreparing orders",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  } else if (orderType === "cancel-order") {
    try {
      await axios.put(
        `${BACKEND_URL}/api/store/orders`,
        {
          orderId,
          status: "CANCELLED_BY_STORE",
        },
        config
      );
      toast({
        title: "Cancel order successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: "An error occurred cancelling orders",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  } else if (orderType === "customer-cancel-order") {
    try {
      await axios.put(
        `${BACKEND_URL}/api/customer/update-status-order`,
        {
          orderId,
          status: "CANCELLED_BY_CUSTOMER",
        },
        config
      );
      toast({
        title: "Cancel order successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      fetchOrders();
    } catch (error) {
      toast({
        title: "An error occurred cancelling orders",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  } 
};
