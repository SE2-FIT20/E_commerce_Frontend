import React from "react";
import "./address.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const Address = ({ address, i, handleDelete }) => {
  const { currentUser, setCurrentUser, BACKEND_URL, config } =
    useContext(AuthContext);
  const [currentAddress, setCurrentAddress] = useState(address);
  const [editingAddress, setEditingAddress] = useState(false);
  const handleKeyDown = async (e) => {
    if (e.key === "Escape") {
      setEditingAddress(false);
    }
    if (e.key === "Enter") {
      handleUpdateAddress();
    }
  };
  const toast = useToast();

  const handleUpdateAddress = async (e) => {
    if (currentAddress === address) {
      setEditingAddress(false);
      return;
    }
    try {
      await axios.put(
        `${BACKEND_URL}/api/customer/account`,
        {
          addresses: [currentAddress, ...currentUser.addresses].filter(
            (a) => a !== address
          ),
        },
        config
      );

      toast({
        title: "Update address successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setEditingAddress(false);

      const { data } = await axios.get(
        `${BACKEND_URL}/api/customer/account`,
        config
      );

      setCurrentUser(data.data);
    } catch (error) {
      toast({
        title: "An error occurred while trying to update address",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleChange = (e) => {
    setCurrentAddress(e.target.value);
  };
  return (
    <li key={i}>
      <div className="addressLeft">
        {!editingAddress && <span>{address}</span>}
        {editingAddress && (
          <input
            type="text"
            value={currentAddress}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>
      <div className="addressRight">
        <div
          className="updateButton"
          onClick={() => setEditingAddress(!editingAddress)}
        >
          <FontAwesomeIcon icon={faPen} />
        </div>
        <div className="deleteButton" onClick={() => handleDelete(address)}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
    </li>
  );
};

export default Address;
