import axios from "axios";

export const handleAddProduct = async (
  product,
  BACKEND_URL,
  config,
  setLoading,
  toast,
  history
) => {
  let images = [];
  if (!product.name || !product.quantity || !product.price || !product.description || !product.category || product.images.length === 0) {
    return toast({
      title: "Please fill all the required fields!",
      status: "warning",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  }
  if (product.images.length > 0) {
    const promises = product.images.map(async (pic) => {
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
          duration: 3000,
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
          category: product.category === "Cars & Motorbikes" ? "CARS_MOTORBIKES" : product.category.toUpperCase(),
          images,
        },
        config
      );
      toast({
        title: "Upload product with images successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      history.push(`/store/product/all?page=1`);
    } catch (error) {
      toast({
        title: "Error uploading product!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);

      return;
    }
  }
};
