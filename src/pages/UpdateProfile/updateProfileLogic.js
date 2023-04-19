import axios from "axios";

export const handleChange = (e, setUserInfo) => {
  setUserInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
};

export const handleChooseImage = (e, setNewAvatar) => {
  setNewAvatar(e.target.files[0]);
};

export const handleUpdateProfile = async (
  e,
  userInfo,
  newAvatar,
  setCurrentUser,
  BACKEND_URL,
  config,
  toast
) => {
  e.preventDefault();
  if (newAvatar) {
    const formData = new FormData();
    formData.append("file", newAvatar);
    formData.append("upload_preset", "BazaarBay");
    formData.append("cloud_name", "dvvyj75uf");
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dvvyj75uf/image/upload",
        formData
      );
      const newAvatar = res.data.url.toString();
      await axios.put(
        `${BACKEND_URL}/api/customer/account`,
        {
          ...userInfo,
          phone: userInfo.phoneNumber,
          avatar: newAvatar,
        },
        config
      );
    } catch (error) {}
    toast({
      title: "Update info with avatar successful",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
    const { data } = await axios.get(
      `${BACKEND_URL}/api/customer/account`,
      config
    );
    setCurrentUser(data.data);
    window.location.reload();

  } else {
    try {
      await axios.put(
        `${BACKEND_URL}/api/customer/account`,
        {
          name: userInfo.name,
          phone: userInfo.phoneNumber,
        },
        config
      );
      toast({
        title: "Update info without avatar successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      const { data } = await axios.get(
        `${BACKEND_URL}/api/customer/account`,
        config
      );
      setCurrentUser(data.data);
      window.location.reload();

    } catch (error) {
      toast({
        title: "An error occurred while trying to update profile",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
};

export const handleUpdateStore = async (
  e,
  storeInfo,
  newAvatar,
  setCurrentUser,
  BACKEND_URL,
  config,
  toast
) => {
  e.preventDefault();
  if (newAvatar) {
    const formData = new FormData();
    formData.append("file", newAvatar);
    formData.append("upload_preset", "BazaarBay");
    formData.append("cloud_name", "dvvyj75uf");
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dvvyj75uf/image/upload",
        formData
      );
      const newAvatar = res.data.url.toString();
      await axios.put(
        `${BACKEND_URL}/api/store/account`,
        {
          ...storeInfo,
          phoneNumber: storeInfo.phoneNumber,
          avatar: newAvatar,
        },
        config
      );
    } catch (error) {}
    toast({
      title: "Update store with avatar successful",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
    const { data } = await axios.get(
      `${BACKEND_URL}/api/store/account`,
      config
    );
    setCurrentUser(data.data);
    window.location.reload();
  } else {
    try {
      await axios.put(
        `${BACKEND_URL}/api/store/account`,
        {
          ...storeInfo,
          phoneNumber: storeInfo.phoneNumber,
        },
        config
      );
      toast({
        title: "Update store without avatar successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      const { data } = await axios.get(
        `${BACKEND_URL}/api/store/account`,
        config
      );
      setCurrentUser(data.data);
      window.location.reload();

    } catch (error) {
      toast({
        title: "An error occurred while trying to update profile",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
};

export const handleUpdateDelivery = async (
  e,
  deliveryInfo,
  newAvatar,
  setCurrentUser,
  BACKEND_URL,
  config,
  toast
) => {
  e.preventDefault();
  if (newAvatar) {
    console.log(deliveryInfo)
    const formData = new FormData();
    formData.append("file", newAvatar);
    formData.append("upload_preset", "BazaarBay");
    formData.append("cloud_name", "dvvyj75uf");
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dvvyj75uf/image/upload",
        formData
      );
      const newAvatar = res.data.url.toString();
      await axios.put(
        `${BACKEND_URL}/api/delivery-partner/account`,
        {
          ...deliveryInfo,
          avatar: newAvatar,
        },
        config
      );
    } catch (error) {}
    toast({
      title: "Update delivery with avatar successful",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
    const { data } = await axios.get(
      `${BACKEND_URL}/api/delivery-partner/account`,
      config
    );
    setCurrentUser(data.data);
    window.location.reload();
  } else {
    try {
      await axios.put(
        `${BACKEND_URL}/api/delivery-partner/account`,
        {
          ...deliveryInfo,
        },
        config
      );
      toast({
        title: "Update delivery without avatar successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      const { data } = await axios.get(
        `${BACKEND_URL}/api/delivery-partner/account`,
        config
      );
      setCurrentUser(data.data);
      window.location.reload();

    } catch (error) {
      toast({
        title: "An error occurred while trying to update profile",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
};