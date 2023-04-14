import React, { useContext, useState, useEffect, useRef } from "react";
import "./store.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useLocation } from "react-router-dom";
import SingleProduct from "../SingleProduct/SingleProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCity,
  faLocationDot,
  faPhone,
  faStar,
  faStore,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

const Store = () => {
  const { BACKEND_URL } = useContext(AuthContext);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [filterOption, setFilterOption] = useState("sold");
  const [filterOrder, setFilterOrder] = useState("desc");
  const [openFilterOrder, setOpenFilterOrder] = useState(false);
  const storeId = location.pathname.split("/")[2];
  const storeProductRef = useRef();

  const fetchStore = async () => {
    try {
      setLoading(true);
      const response1 = await axios.get(
        `${BACKEND_URL}/api/store-information/${storeId}`
      );
      setStore(response1.data.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

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
  console.log(store);
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
                    <span>{store.email + "@gmail.com"}</span>
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
                        Products: <span>{`16`}</span>
                      </span>
                    </div>
                    <div className="storeInfoItem">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="storeInfoIcon"
                      />
                      <span>
                        Address: <span>445 Au Co</span>
                      </span>
                    </div>
                    <div className="storeInfoItem">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="storeInfoIcon"
                      />
                      <span>
                        Phone: <span>0825134034</span>
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
                        Rating: <span>5.0</span>
                      </span>
                    </div>
                    <div className="storeInfoItem">
                      <FontAwesomeIcon
                        icon={faCity}
                        className="storeInfoIcon"
                      />
                      <span>
                        City: <span>Hanoi</span>
                      </span>
                    </div>
                    <div className="storeInfoItem">
                      <FontAwesomeIcon
                        icon={faUserCheck}
                        className="storeInfoIcon"
                      />
                      <span>
                        Created At: <span>1 year ago</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="storeDescription">
            <h2>Description</h2>
            <div className="storeDescriptionContainer">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto
              qui, eum maxime distinctio consequuntur in facilis numquam,
              sapiente totam ipsum aliquam praesentium ipsam fugiat id laborum
              dolorem quam iste quod modi. Quasi eligendi explicabo voluptatem
              impedit quisquam eius laboriosam, voluptates labore! Aperiam
              quisquam neque odit debitis soluta, ducimus accusamus omnis. Autem
              cum nam officiis dolor, magni, ab ad veniam, vitae optio et error
              dignissimos asperiores blanditiis iste magnam? Sapiente ipsum
              reiciendis eligendi praesentium cupiditate ut natus veritatis
              laboriosam itaque pariatur, officiis vero facere ipsa delectus
              fugiat neque doloremque nobis tenetur nemo omnis debitis repellat!
              Est earum ex sit voluptatem reiciendis.
            </div>
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
    </div>
  );
};

export default Store;
