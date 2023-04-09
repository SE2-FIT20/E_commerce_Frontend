export const handleChooseOption = (option, setOption, history) => {
  switch (option) {
    case "All Users":
      history.push("/admin/users/all?pages=1");
      setOption("All Orders");
      break;
    case "All Customers":
      history.push("/admin/users/customers?pages=1");
      setOption("All Orders");
      break;
    case "All Stores":
      history.push("/admin/users/stores?pages=1");
      setOption("Ready Orders");
      break;
    case "All Delivery Partners":
      history.push("/admin/users/delivery-partners?pages=1");
      setOption("Delivering Orders");
      break;
    case "All Products":
      history.push("/admin/product/all?pages=1");
      setOption("All Products");
      break;
    case "Add a Product":
      history.push("/admin/product/new");
      setOption("Add a Product");
      break;
  }
};

export const handleNavigateOption = (location) => {
  if (location.startsWith("/admin/users/all")) {
    return "All Users";
  } else if (location.startsWith("/admin/users/customers")) {
    return "All Customers";
  } else if (location.startsWith("/admin/users/stores")) {
    return "All Stores";
  } else if (location.startsWith("/admin/users/delivery-partners")) {
    return "All Delivery Partners";
  } else if (location.startsWith("/admin/order/delivered")) {
    return "Delivered Orders";
  } else if (location.startsWith("/admin/order/cancelled")) {
    return "Cancelled Orders";
  } else if (
    location.startsWith("/admin/product/all") ||
    location.startsWith("/admin/product/active") ||
    location.startsWith("/admin/product/soldout")
  ) {
    return "All Products";
  } else if (location.startsWith("/admin/product/new")) {
    return "Add a Product";
  } else {
    return "";
  }
};
