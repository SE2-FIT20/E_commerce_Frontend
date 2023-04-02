import React from "react";
import "./productReview.css";
import ReactStars from "react-rating-stars-component";

const ProductReview = () => {
  return (
    <li>
      <div className="reviewLeft">
        <img
          src="https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/273210834_3086464761611742_3914305251108406206_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=GpZUB-TOXNUAX9fnPSj&_nc_ht=scontent.fhan14-3.fna&oh=00_AfA92m10XiplbJb0QeM-d8Rw0HB1neXeo_mJdUsJfh3JqQ&oe=640D4AC3"
          alt=""
        />
      </div>
      <div className="reviewRight">
        <div className="customerName">Minh Quan</div>
        <div className="customerVote">
          <ReactStars
            count={5}
            size={24}
            value={4}
            edit={true}
            activeColor="#ffd700"
          />
        </div>
        <div className="customerReview">nhu cut'</div>
        <div className="customerImages"></div>
      </div>
    </li>
  );
};

export default ProductReview;
