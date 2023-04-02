import axios from "axios";

export const handleUpdateProduct = async (
  product,
  BACKEND_URL,
  config,
  toast,
  history
) => {
  let images = [];
  if (product.newImages.length > 0) {
    const promises = product.newImages.map(async (pic) => {
      const data = new FormData();
      data.append(`file`, pic);
      data.append("upload_preset", "MQSocial");
      data.append("cloud_name", "dvvyj75uf");
      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dvvyj75uf/image/upload",
          {
            method: "post",
            body: data,
          }
        );
        const json = await response.json();
        return json.url.toString();
      } catch (error) {
        toast({
          title: "Error uploading images!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
    });
    images = await Promise.all(promises);
    try {
      await axios.put(
        `${BACKEND_URL}/api/stores/products`,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          quantity: product.quantity,
          category: product.category,
          images: [...product.images, ...images],
        },
        config
      );
      toast({
        title: "Upload product with images successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      history.push(`/store/product/all?page=1`);
    } catch (error) {
      toast({
        title: "Error uploading product!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  } else {
    try {
      await axios.put(
        `${BACKEND_URL}/api/stores/products`,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          quantity: product.quantity,
          category: product.category,
          images: product.images,
        },
        config
      );
      toast({
        title: "Upload product with images successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      history.push(`/store/product/all?page=1`);
    } catch (error) {
      toast({
        title: "Error uploading product!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  }
};
