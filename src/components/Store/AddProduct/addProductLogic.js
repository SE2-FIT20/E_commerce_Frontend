import axios from "axios";


export const handleAddProduct = async (product, BACKEND_URL, config, toast, history) => {
  let images = [];
  if (product.images.length > 0) {
    const promises = product.images.map(async (pic) => {
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
      await axios.post(
        `${BACKEND_URL}/api/store/products`,
        {
          ...product,
          category: product.category.toUpperCase(),
          images,
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