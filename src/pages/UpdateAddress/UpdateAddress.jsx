import { useState, useContext } from "react";
import "./updateAddress.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const UpdateAddress = () => {
  const { currentUser, setCurrentUser, config, BACKEND_URL } = useContext(AuthContext);
  const [addressText, setAddressText] = useState("");
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const toast = useToast();
  const handleKeyDown = async (e) => {
    if (e.key === "Escape") {
      setAddingNewAddress(false);
    }
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handleSave = async(e) => {
    try {
      await axios.put(`${BACKEND_URL}/api/customer/account`, {
        addresses: [addressText, ...currentUser.addresses], 
      }, config)

      toast({
        title: "Add new address successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      const { data } = await axios.get(
        `https://e-commerce-production-43d5.up.railway.app/api/customer/account`,
        config
      );
      setCurrentUser(data.data);
      setAddressText("")
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

  const handleDelete = async(address) => {
    try {
      await axios.put(`${BACKEND_URL}/api/customer/account`, {
        addresses: currentUser.addresses.filter((item) => item !== address), 
      }, config)

      toast({
        title: "Delete address successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      const { data } = await axios.get(
        `https://e-commerce-production-43d5.up.railway.app/api/customer/account`,
        config
      );
      setCurrentUser(data.data);
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
  const handleChange = (e) => {
    setAddressText(e.target.value);
  };
  return (
    <div className="updateAddress">
      <div className="updateAddressContainer">
        <div className="updateAddressTitle">
          <h2>My Address</h2>
          {!addingNewAddress && (
            <button
              className="button addNewAddressBtn"
              onClick={() => setAddingNewAddress(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New Address</span>
            </button>
          )}
          {addingNewAddress && (
            <div className="addNewAddressContainer">
              <div className="addNewAddressInput">
                <input
                  type="text"
                  placeholder="Add a new address..."
                  value={addressText}
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                />
                <span>0/100</span>
              </div>
              <div className="addAddressOperations">
                <span>Press Esc to cancel</span>
                <button onClick={handleSave}>Save</button>
              </div>
            </div>
          )}
        </div>
        <div className="updateAddressBody">
          <ul>
            {currentUser.addresses.length > 0 &&
              currentUser.addresses.map((address, i) => (
                <li ley={i}>
                  <div className="addressLeft">
                    <span>{address}</span>
                  </div>
                  <div className="addressRight">
                    <div className="updateButton">
                      <FontAwesomeIcon icon={faPen} />
                    </div>
                    <div className="deleteButton" onClick={() => handleDelete(address)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </div>
                  </div>
                </li>
              ))}
            {currentUser.addresses.length === 0 && <div>You don't have any address!</div>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UpdateAddress;
