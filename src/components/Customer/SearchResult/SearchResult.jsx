import { useContext, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import SingleProduct from "../SingleProduct/SingleProduct";
import "./searchResult.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faShirt,
  faStar,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import NoResult from "../../../images/no-result-image.jpg";
import StarRatings from "react-star-ratings";
import { formatDaysAgo } from "../../longFunctions";
import axios from "axios";
import Footer from "../Footer/Footer";

const SearchResult = () => {
  const { BACKEND_URL } = useContext(AuthContext);
  const history = useHistory();
  const keyword = useLocation().search.split("=")[1];
  const [currentStoreShown, setCurrentStoreShown] = useState(2);
  const [productResults, setProductResults] = useState([]);
  const [storeResults, setStoreResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const fetchSearchResult = async () => {
    setLoading(true);
    try {
      const response1 = await axios.get(
        `${BACKEND_URL}/api/search-products?keyword=${keyword.trim()}&elementsPerPage=10&page=${
          pageNumber - 1
        }`
      );
      const response2 = await axios.get(
        `${BACKEND_URL}/api/search-stores?keyword=${keyword.trim()}`
      );
      setProductResults(response1.data.data.content);
      setStoreResults(response2.data.data.content);
      setTotalPages(response1.data.data.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const pageNumberList = [];
  pageNumberList.push(
    <li
      key={1}
      onClick={() => {
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
        }}
      >
        <div className={pageNumber === totalPages ? "currentPage" : ""}>
          {totalPages}
        </div>
      </li>
    );

  const handleClickPrev = () => {
    setPageNumber((prev) => (prev === 1 ? 1 : prev - 1));
  };

  const handleClickNext = () => {
    setPageNumber((prev) => (prev === totalPages ? prev : prev + 1));
  };
  console.log(storeResults);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [keyword]);

  useEffect(() => {
    fetchSearchResult();
    document.title = `Search for "${keyword}" | BazaarBay`;
  }, [keyword, pageNumber]);
  return (
    <div
      className="searchResult"
      style={{
        backgroundColor:
          storeResults.length === 0 && productResults.length === 0 && "#ffffff",
      }}
    >
      <div className="searchResultContainer">
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
        {storeResults.length === 0 &&
          productResults.length === 0 &&
          !loading && (
            <div className="noResult">
              <img src={NoResult} alt="" />
              <span>No results found</span>
            </div>
          )}
        {!loading && storeResults.length > 0 && (
          <div className="searchStore">
            <span>{`All stores related to "${keyword}"`}</span>
            <ul className="singleStore">
              {storeResults.slice(0, currentStoreShown).map((store) => (
                <li
                  key={store.id}
                  onClick={() => history.push(`/store/${store.id}`)}
                >
                  <div className="storeLeft">
                    <img src={store.avatar} alt="" />
                    <div className="storeLeftInfo">
                      <h2>{store.name}</h2>
                      <div>
                        <StarRatings
                          rating={store.averageProductRating}
                          starRatedColor="#ffd700"
                          numberOfStars={5}
                          name="rating"
                          starDimension="15px"
                          starSpacing="0px"
                        />
                        <span>{store.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="storeRight">
                    <div className="storeRightItem">
                      <h4>
                        <FontAwesomeIcon
                          icon={faShirt}
                          style={{ fontWeight: "thin" }}
                        />
                        <span>{`${store.numberOfProducts}`}</span>
                      </h4>
                      <span>Products</span>
                    </div>
                    <div className="storeRightItem">
                      <h4>
                        <FontAwesomeIcon icon={faStar} />
                        <span>{store.averageProductRating}</span>
                      </h4>
                      <span>Rating</span>
                    </div>

                    <div className="storeRightItem">
                      <h4>
                        <FontAwesomeIcon icon={faUserCheck} />
                        <span>{formatDaysAgo(store.createdAt)}</span>
                      </h4>
                      <span>Created At</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {storeResults.length > 2 && (
              <div className="showStoreButtons">
                {currentStoreShown < storeResults.length && (
                  <button
                    className="button"
                    onClick={() => setCurrentStoreShown((prev) => prev + 2)}
                  >
                    Show more results
                  </button>
                )}

                {currentStoreShown > 2 && (
                  <button
                    className="button"
                    onClick={() => setCurrentStoreShown(2)}
                  >
                    Show less results
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {!loading && productResults.length > 0 && (
          <div className="product">
            <span>{`All products related to "${keyword}"`}</span>
            <ul className="productResults">
              {productResults.map((product) => (
                <SingleProduct product={product} search={true} />
              ))}
            </ul>
            <div className="productNav">
              <ul>
                <li>
                  <button className="button" onClick={() => handleClickPrev()}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <span>Previous</span>
                  </button>
                </li>
                {pageNumberList}
                <li>
                  <button className="button" onClick={() => handleClickNext()}>
                    <span>Next</span>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResult;
