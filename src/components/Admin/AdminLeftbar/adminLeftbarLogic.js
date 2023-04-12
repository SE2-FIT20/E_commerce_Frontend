export const handleChooseOption = (option, setOption, history) => {
  switch (option) {
    case "all":
      history.push("/admin/users/all?page=1");
      setOption("all");
      break;
    case "customer":
      history.push("/admin/users/customer?page=1");
      setOption("customer");
      break;
    case "store":
      history.push("/admin/users/store?page=1");
      setOption("store");
      break;
    case "delivery-partner":
      history.push("/admin/users/delivery-partner?page=1");
      setOption("delivery-partner");
      break;
    case "product":
      history.push("/admin/products?page=1");
      setOption("product");
      break;
  }
};

export const handleNavigateOption = (location) => {
  if (location.startsWith("/admin/users/all")) {
    return "all";
  } else if (location.startsWith("/admin/users/customer")) {
    return "customer";
  } else if (location.startsWith("/admin/users/store")) {
    return "store";
  } else if (location.startsWith("/admin/users/delivery-partner")) {
    return "delivery-partner";
  } else if (location.startsWith("/admin/products")) {
    return "product";
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
