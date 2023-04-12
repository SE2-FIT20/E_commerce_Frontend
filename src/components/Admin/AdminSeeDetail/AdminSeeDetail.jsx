import React from "react";
import "./adminSeeDetail.css";
import { formatDate, formatNumber } from "../../longFunctions";
import { useRef } from "react";
import { useEffect } from "react";
import StarRatings from "react-star-ratings";

const AdminSeeDetail = ({ user, product, open, setOpen }) => {
  const adminSeeDetailRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        adminSeeDetailRef.current &&
        !adminSeeDetailRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [adminSeeDetailRef]);
  return (
    <div className={open ? "adminSeeDetail" : "adminSeeDetail hide"}>
      {user && (
        <div className="adminSeeDetailContainer" ref={adminSeeDetailRef}>
          <h2 className="userRole">{user.role}</h2>
          <div className="userTop">
            <div className="userLeft">
              <img src={user.avatar} alt="" />
            </div>
            <div className="userRight">
              <div className="userId">
                <h2>ID:</h2>
                <span>{user.id}</span>
              </div>
              <div className="userEmail">
                <h2>Email:</h2>
                <span>{user.email}</span>
              </div>
              <div className="userName">
                <h2>Name: </h2>
                <span>{user.name}</span>
              </div>
              <div className="userPhone">
                <h2>Phone: </h2>
                <span>{user.name}</span>
              </div>
              <div className="userCreatedAt">
                <h2>Created at: </h2>
                <span>{formatDate(user.createdAt)}</span>
              </div>
              <div className="userAddress" style={{ alignItems: "flex-start" }}>
                <h2>Addresses: </h2>
                <span>
                  <ul>
                    <li>- 445 Au Co</li>
                    <li>- 445 Au Co</li>
                    <li>- 445 Au Co</li>
                  </ul>
                </span>
              </div>
              <div className="userCreatedAt">
                <h2>Locked: </h2>
                <span>{user.locked ? "True" : "False"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {product && (
        <div className="adminSeeDetailContainer" ref={adminSeeDetailRef}>
          <h2 className="userRole">{product.name}</h2>
          <div className="userTop">
            <div className="userLeft">
              <img src={product.images[0]} alt="" className="productImage" />
            </div>
            <div className="userRight">
              <div className="userId">
                <h2>ID:</h2>
                <span>{product.id}</span>
              </div>
              <div className="userEmail">
                <h2>Price:</h2>
                <span>
                  <div className="price-symbol">₫</div>
                  {formatNumber(product.price)}
                </span>
              </div>
              <div className="userName">
                <h2>Store </h2>
                <span>{product.store.name}</span>
              </div>
              <div className="userPhone">
                <h2>Rating: </h2>
                <span style={{ display: "flex", alignItems: "center"}}>
                  <StarRatings
                    rating={product.rating}
                    starRatedColor="#ffd700"
                    numberOfStars={5}
                    name="rating"
                    starDimension="17px"
                    starSpacing="0px"
                  />
                </span>
              </div>
              <div className="userPhone">
                <h2>Sold: </h2>
                <span>{product.sold}</span>
              </div>
              <div className="userCreatedAt">
                <h2>Created at: </h2>
                <span>{formatDate(product.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSeeDetail;
