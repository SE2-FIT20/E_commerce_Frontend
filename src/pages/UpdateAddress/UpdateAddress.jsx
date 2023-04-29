import { useState, useContext, useEffect } from "react";
import "./updateAddress.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import Address from "../../components/Customer/Address/Address";
import Footer from "../../components/Customer/Footer/Footer";
import CustomerPopup from "../../components/Customer/CustomerPopup/CustomerPopup";

const UpdateAddress = () => {
  const { currentUser, setCurrentUser, config, BACKEND_URL } =
    useContext(AuthContext);
  const [addressText, setAddressText] = useState("");
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const toast = useToast();
  const handleKeyDown = async (e) => {
    if (e.key === "Escape") {
      setAddingNewAddress(false);
    }
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handleSave = async (e) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/customer/account`,
        {
          addresses: [addressText, ...currentUser.addresses],
        },
        config
      );

      toast({
        title: "Add new address successful",
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
      setAddingNewAddress(false);
      setAddressText("");
    } catch (error) {
      if (
        error.response.data.message ===
        "Your account is locked! Please contact admin to unlock your account!"
      ) {
        setOpenPopup(true);
        return;
      }
      toast({
        title: "An error occurred while trying to save new address",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleDelete = async (address) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/customer/account`,
        {
          addresses: currentUser.addresses.filter((item) => item !== address),
        },
        config
      );

      toast({
        title: "Delete address successful",
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
    } catch (error) {
      if (
        error.response.data.message ===
        "Your account is locked! Please contact admin to unlock your account!"
      ) {
        setOpenPopup(true);
        return;
      }
      toast({
        title: "An error occurred while trying to delete address",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleChange = (e) => {
    setAddressText(e.target.value);
  };

  useEffect(() => {
    document.title = "My Address | BazaarBay";
  }, []);
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
                <span>{`${addressText.length}/100`}</span>
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
                <Address address={address} i={i} handleDelete={handleDelete} />
              ))}
            {currentUser.addresses.length === 0 && (
              <div>You don't have any address!</div>
            )}
          </ul>
        </div>
      </div>
      <CustomerPopup open={openPopup} setOpen={setOpenPopup} popupType="account-locked" />

      <Footer />
    </div>
  );
};

export default UpdateAddress;
