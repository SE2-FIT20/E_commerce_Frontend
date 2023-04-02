import { useContext, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import SingleProduct from "../SingleProduct/SingleProduct";
import "./searchResult.css";
import NoResult from "../../../images/no-result-image.jpg";
import axios from "axios";

const SearchResult = () => {
  const { BACKEND_URL } = useContext(AuthContext);
  const history = useHistory();
  const keyword = useLocation().search.split("=")[1];
  const [currentStoreShown, setCurrentStoreShown] = useState(2);
  const [productResults, setProductResults] = useState([]);
  const [storeResults, setStoreResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchSearchResult = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/search?keyword=${keyword.replace(/\s/g, "")}`
      );
      setProductResults(data.data.products);
      setStoreResults(data.data.stores);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResult();
  }, [keyword]);
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
          <div className="store">
            <span>{`All stores related to "${keyword}"`}</span>
            <ul className="singleStore">
              {storeResults.slice(0, currentStoreShown).map((store) => (
                <li
                  key={store.id}
                  onClick={() => history.push(`/store/${store.id}`)}
                >
                  <div className="storeLeft">
                    <img src={store.avatar} alt="" />
                    <h2>{store.name}</h2>
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
                <SingleProduct product={product} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
