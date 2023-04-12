export const handleChooseOption = (option, setOption, history) => {
  switch (option) {
    case "All Orders":
      history.push("/store/order/all?pages=1");
      setOption("All Orders");
      break;
    case "Pending Orders":
      history.push("/store/order/pending?pages=1");
      setOption("All Orders");
      break;
    case "Ready Orders":
      history.push("/store/order/ready?pages=1");
      setOption("Ready Orders");
      break;
    case "Delivering Orders":
      history.push("/store/order/delivering?pages=1");
      setOption("Delivering Orders");
      break;
    case "Delivered Orders":
      history.push("/store/order/delivered?pages=1");
      setOption("Delivered Orders");
      break;
    case "Cancelled Orders":
      history.push("/store/order/cancelled?pages=1");
      setOption("Cancelled Orders");
      break;
    case "All Products":
      history.push("/store/product/all?pages=1");
      setOption("All Products");
      break;
    case "Add a Product":
      history.push("/store/new/product");
      setOption("Add a Product");
      break;
  }
};

export const handleNavigateOption = (location) => {
  if (location.startsWith("/store/order/all")) {
    return "All Orders";
  } else if (location.startsWith("/store/order/ready")) {
    return "Ready Orders";
  } else if (location.startsWith("/store/order/pending")) {
    return "Pending Orders";
  } else if (location.startsWith("/store/order/delivering")) {
    return "Delivering Orders";
  } else if (location.startsWith("/store/order/delivered")) {
    return "Delivered Orders";
  } else if (location.startsWith("/store/order/cancelled")) {
    return "Cancelled Orders";
  } else if (
    location.startsWith("/store/product/all") ||
    location.startsWith("/store/product/active") ||
    location.startsWith("/store/product/soldout")
  ) {
    return "All Products";
  } else if (location.startsWith("/store/new/product")) {
    return "Add a Product";
  } else {
    return "";
  }
};
