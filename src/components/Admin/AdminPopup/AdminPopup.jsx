import React from "react";
import { useRef, useEffect } from "react";
import "./adminPopup.css";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useToast } from "@chakra-ui/react";

const AdminPopup = ({
  open,
  setOpen,
  popupType,
  user,
  product,
  refetchUsers,
  refetchProducts,
}) => {
  const popup = useRef();
  const toast = useToast();
  const { BACKEND_URL, config } = useContext(AuthContext);
  const handleConfirm = async (popupType) => {
    if (popupType === "lockUser") {
      try {
        await axios.put(
          `${BACKEND_URL}/api/admin/manage-accounts`,
          {
            userId: user.id,
            operation: "LOCK",
          },
          config
        );
        toast({
          title: "Lock user successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setOpen(false);
        refetchUsers();
      } catch (error) {
        toast({
          title: "An error occurred locking users",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setOpen(false);
      }
    } else if (popupType === "unlockUser") {
      try {
        await axios.put(
          `${BACKEND_URL}/api/admin/manage-accounts`,
          {
            userId: user.id,
            operation: "UNLOCK",
          },
          config
        );
        toast({
          title: "Unlock user successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setOpen(false);
        refetchUsers();
      } catch (error) {
        toast({
          title: "An error occurred unlocking users",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setOpen(false);
      }
    } else if (popupType === "deleteProduct") {
      try {
        await axios.put(
          `${BACKEND_URL}/api/admin/delete-product/${product.id}`,
          config
        );
        toast({
          title: "Delete product user successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setOpen(false);
        refetchUsers();
      } catch (error) {
        toast({
          title: "An error occurred deleting products",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popup.current && !popup.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popup]);
  return (
    <div className={open ? "popup" : "popup hide"}>
      <div className="popupContainer" ref={popup}>
        <div className="deleteTitle">
          {popupType === "lockUser" && (
            <span>{`Are you sure you want to lock ${
              user.role == "DELIVERY_PARTNER"
                ? "delivery partner"
                : user.role.toLowerCase()
            } "${user.name}"?`}</span>
          )}
          {popupType === "unlockUser" && (
            <span>{`Are you sure you want to unlock ${
              user.role == "DELIVERY_PARTNER"
                ? "delivery partner"
                : user.role.toLowerCase()
            } "${user.name}"?`}</span>
          )}
          {popupType === "deleteProduct" && (
            <span>{`Are you sure you want to delete product" ${product.name}"?`}</span>
          )}
        </div>
        <div className="deleteBtnContainer">
          <button className="button" onClick={() => handleConfirm(popupType)}>
            Yes
          </button>
          <button className="button" onClick={() => setOpen(false)}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPopup;
