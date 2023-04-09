import axios from "axios";

export const handleUpdateProduct = async (
  product,
  productId,
  BACKEND_URL,
  setLoading,
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
        setLoading(true);
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
      const data =  {
        productId: productId,
        name: product.name,
        price: product.price,
        description: product.description,
        quantity: product.quantity,
        category: product.category.toUpperCase(),
        images: [...product.images, ...images],
      };
      const payload = JSON.stringify(data, null, 2);

      await axios.put(
        `${BACKEND_URL}/api/store/products`,
        payload,
        config
      );
      toast({
        title: "Upload product with images successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      history.push(`/store/product/all?page=1`);
    } catch (error) {
      setLoading(false);
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
        `${BACKEND_URL}/api/store/products`,
        {
          productId: productId,
          name: product.name,
          price: product.price,
          description: product.description,
          quantity: product.quantity,
          category: product.category.toUpperCase(),
          images: product.images,
        },
        config
      );
      toast({
        title: "Upload product without images successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      history.push(`/store/product/all?page=1`);
    } catch (error) {
      toast({
        title: "Error uploading product!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  }
};
