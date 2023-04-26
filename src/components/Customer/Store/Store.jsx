import React, { useContext, useState, useEffect, useRef } from "react";
import "./store.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useHistory, useLocation } from "react-router-dom";
import SingleProduct from "../SingleProduct/SingleProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  formatDaysAgo,
  revertTimeStamp,
  formatDaysLeft,
  formatDaysToStart,
} from "../../longFunctions";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCity,
  faClock,
  faLocationDot,
  faPhone,
  faStar,
  faStore,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../Footer/Footer";
import { useToast } from "@chakra-ui/react";

const Store = () => {
  const { BACKEND_URL, config, currentUser } = useContext(AuthContext);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const [readMore, setReadMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [filterOption, setFilterOption] = useState("sold");
  const [filterOrder, setFilterOrder] = useState("desc");
  const [openFilterOrder, setOpenFilterOrder] = useState(false);
  const [position, setPosition] = useState(0);
  const [maxWidth, setMaxWidth] = useState(0);
  const couponsRef = useRef();
  const storeId = location.pathname.split("/")[2];
  const storeProductRef = useRef();
  const toast = useToast();
  const history = useHistory();
  const fetchStore = async () => {
    try {
      setLoading(true);
      const response1 = await axios.get(
        `${BACKEND_URL}/api/store-information/${storeId}`
      );
      setStore(response1.data.data);
      const response2 = await axios.get(
        `${BACKEND_URL}/api/coupon-sets/store/${storeId}`
      );
      setCoupons(response2.data.data.content);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  console.log(coupons)
  const fetchProducts = async () => {
    try {
      setProductLoading(true);

      const response = await axios.get(
        `${BACKEND_URL}/api/products?storeId=${storeId.toString()}&filter=${filterOption}&sortBy=${filterOrder}&elementsPerPage=20&page=${
          pageNumber - 1
        }`
      );
      setProducts(response.data.data.content);
      setTotalPages(response.data.data.totalPages);

      setProductLoading(false);
    } catch (error) {
      setProductLoading(false);
    }
  };
  const handleClickPrevCoupon = () => {
    setPosition(Math.max(position - 400, 0));
  };

  const handleClickNextCoupon = () => {
    setPosition(Math.min(position + 400, maxWidth));
  };
  const pageNumberList = [];
  pageNumberList.push(
    <li
      key={1}
      onClick={() => {
        handleScroll();
        setPageNumber(1);
      }}
    >
      <div className={pageNumber === 1 ? "currentPage" : ""}>{1}</div>
    </li>
  );

  // add middle pages
  // add middle pages
  for (let i = 2; i < totalPages; i++) {
    if (
      i === pageNumber ||
      i === pageNumber - 1 ||
      i === pageNumber + 1 ||
      i === 1 ||
      i === totalPages
    ) {
      pageNumberList.push(
        <li
          key={i}
          onClick={() => {
            setPageNumber(i);
            handleScroll();
          }}
        >
          <div className={pageNumber === i ? "currentPage" : ""}>{i}</div>
        </li>
      );
    } else if (
      (i === pageNumber - 2 && pageNumber > 3) ||
      (i === pageNumber + 2 && pageNumber < totalPages - 2)
    ) {
      pageNumberList.push(<li key={i}>...</li>);
    }
  }

  // add last page
  totalPages > 1 &&
    pageNumberList.push(
      <li
        key={totalPages}
        onClick={() => {
          setPageNumber(totalPages);
          handleScroll();
        }}
      >
        <div className={pageNumber === totalPages ? "currentPage" : ""}>
          {totalPages}
        </div>
      </li>
    );

  const handleSaveCoupon = async (couponId) => {
    console.log(couponId)
    try {
      await axios.put(
        `${BACKEND_URL}/api/customer/vouchers-coupons/${couponId}`,
        {},
        config
      );
      toast({
        title: "Save coupon successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "You already saved this coupon!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleScroll = () => {
    storeProductRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const handleClickPrev = () => {
    setPageNumber((prev) => (prev === 1 ? 1 : prev - 1));
    handleScroll();
  };

  const handleClickNext = () => {
    setPageNumber((prev) => (prev === totalPages ? prev : prev + 1));
    handleScroll();
  };

  useEffect(() => {
    fetchProducts();
  }, [filterOption, filterOrder, pageNumber]);
  useEffect(() => {
    fetchStore();
  }, [storeId]);

  useEffect(() => {
    if (couponsRef.current) {
      const maxPos =
        couponsRef.current.scrollWidth - couponsRef.current.clientWidth;
      setMaxWidth(maxPos);
    }
  });

  if (store) document.title = `${store.name} | BazaarBay`;

  return (
    <div className="store">
      {!loading && (
        <div className="storeContainer">
          {store && (
            <div className="storeInfo">
              <div className="storeInfoContainer">
                <div className="storeInfoLeft">
                  <img src={store.avatar} alt="" />
                  <div className="storeName">
                    <h2>{store.name}</h2>
                    <span>{store.email}</span>
                  </div>
                </div>
                <div className="storeInfoRight">
                  <div className="storeInfoRightCol">
                    <div className="storeInfoItem">
                      <FontAwesomeIcon
                        icon={faStore}
                        className="storeInfoIcon"
                      />
                      <span>
                        Products: <span>{`${store.numberOfProducts}`}</span>
                      </span>
                    </div>
                    <div className="storeInfoItem">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="storeInfoIcon"
                      />
                      <span>
                        Address: <span>{store.address}</span>
                      </span>
                    </div>
                    <div className="storeInfoItem">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="storeInfoIcon"
                      />
                      <span>
                        Phone: <span>{store.phoneNumber}</span>
                      </span>
                    </div>
                  </div>
                  <div className="storeInfoRightCol">
                    <div className="storeInfoItem">
                      <FontAwesomeIcon
                        icon={faStar}
                        className="storeInfoIcon"
                      />
                      <span>
                        Rating: <span>{store.averageProductRating}</span>
                      </span>
                    </div>
                    <div className="storeInfoItem">
                      <FontAwesomeIcon
                        icon={faCity}
                        className="storeInfoIcon"
                      />
                      <span>
                        City: <span>{store.city}</span>
                      </span>
                    </div>
                    <div className="storeInfoItem">
                      <FontAwesomeIcon
                        icon={faUserCheck}
                        className="storeInfoIcon"
                      />
                      <span>
                        Created At:{" "}
                        <span>{formatDaysAgo(store.createdAt)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {coupons.length > 0 && (
            <div className="storeCoupons">
              <div className="storeCouponsContainer">
                {store && <h2>{`Coupons`}</h2>}
                <div className="couponListWrapper">
                  {position > 0 && (
                    <div
                      className="couponPrevBtn"
                      onClick={handleClickPrevCoupon}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                  )}
                  {position < maxWidth && (
                    <div
                      className="couponNextBtn"
                      onClick={handleClickNextCoupon}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                  )}

                  <div className="couponList">
                    <div
                      className="couponListContainer"
                      ref={couponsRef}
                      style={{
                        transform: `translateX(-${position}px)`,
                      }}
                    >
                      {coupons.map((coupon) => (
                        <div className="voucher" key={coupon.id}>
                          <div className="voucherLeft">
                            <div className="voucherImage">
                              <img src={coupon.store.avatar} alt="" />
                              <span>{coupon.store.name}</span>
                            </div>
                            <div className="voucherInfo">
                              <div className="voucherBasicInfo">
                                <h2 className="voucherPercent">{`Discount ${coupon.percent}%`}</h2>
                                <span className="voucherDescription">
                                  {`${coupon.description.substring(0, 40)}${
                                    coupon.description.length > 40 ? "..." : ""
                                  }`}
                                </span>
                              </div>
                              {revertTimeStamp(coupon.startAt) >=
                                revertTimeStamp(new Date()) && (
                                <span className="voucherExpired">
                                  <FontAwesomeIcon icon={faClock} />
                                  <span>
                                    {formatDaysToStart(coupon.startAt)}
                                  </span>
                                </span>
                              )}
                              {revertTimeStamp(coupon.startAt) <
                                revertTimeStamp(new Date()) && (
                                <span className="voucherExpired">
                                  <FontAwesomeIcon icon={faClock} />
                                  <span>
                                    {formatDaysLeft(coupon.expiredAt)}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="voucherRight">
                            <span>{`${coupon.quantityAvailable} remaining`}</span>
                            <button
                              className="button"
                              onClick={() => {
                                currentUser
                                  ? handleSaveCoupon(coupon.id)
                                  : history.push("/login");
                              }}
                            >
                              Get
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="storeDescription">
            <h2>Description</h2>
            {store?.description && (
              <div
                className="storeDescriptionContainer"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {store &&
                  (readMore
                    ? store.description + "\n"
                    : store.description.substring(0, 600)) + "\n"}
                {store.description.length > 600 && (
                  <span
                    className="readMoreText"
                    onClick={() => setReadMore(!readMore)}
                  >
                    {readMore ? "Show less" : "Read more"}
                  </span>
                )}
              </div>
            )}
            {!store?.description && (
              <div className="storeDescriptionContainer">No description</div>
            )}
          </div>
          <div className="storeProducts">
            <div className="filterSection">
              <div className="filterSectionContainer">
                <span>Filtered by</span>
                <ul>
                  <li>
                    <button
                      className={filterOption === "sold" ? "selected" : ""}
                      onClick={() => setFilterOption("sold")}
                    >
                      Popularity
                    </button>
                  </li>
                  <li>
                    <button
                      className={filterOption === "createdAt" ? "selected" : ""}
                      onClick={() => setFilterOption("createdAt")}
                    >
                      Latest
                    </button>
                  </li>
                  <li>
                    <button
                      className={filterOption === "price" ? "selected" : ""}
                      onClick={() => setFilterOption("price")}
                    >
                      Price
                    </button>
                  </li>
                  <li>
                    <button
                      className="filterOrder"
                      onClick={() => setOpenFilterOrder(!openFilterOrder)}
                      style={{ position: "relative" }}
                    >
                      <span>{filterOrder === "asc" ? "A-Z" : "Z-A"}</span>
                      <FontAwesomeIcon icon={faChevronDown} />
                      <ul
                        className={
                          openFilterOrder
                            ? "filterOptions open"
                            : "filterOptions"
                        }
                        style={{
                          border: openFilterOrder ? "1px solid #ccc" : "none",
                        }}
                      >
                        <li onClick={() => setFilterOrder("asc")}>A-Z</li>
                        <li onClick={() => setFilterOrder("desc")}>Z-A</li>
                      </ul>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="storeProductsDisplay" ref={storeProductRef}>
              {!productLoading && (
                <>
                  <ul>
                    {products.map((product) => (
                      <SingleProduct product={product} key={product.id} />
                    ))}
                  </ul>
                  <div className="productNav">
                    <ul>
                      <li>
                        <button
                          className="button"
                          onClick={() => handleClickPrev()}
                        >
                          <FontAwesomeIcon icon={faChevronLeft} />
                          <span>Previous</span>
                        </button>
                      </li>
                      {pageNumberList}
                      <li>
                        <button
                          className="button"
                          onClick={() => handleClickNext()}
                        >
                          <span>Next</span>
                          <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
              {productLoading && (
                <div className="partialLoading">
                  <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fullLoading">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Store;
