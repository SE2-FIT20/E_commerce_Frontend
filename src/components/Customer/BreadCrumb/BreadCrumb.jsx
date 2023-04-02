import React from "react";
import "./breadCrumb.css";

const BreadCrumb = ({ title }) => {
  return (
    <div className="breadcrumb mb-0 py-4">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <p className="text-center mb-0">
              <a href="/" className="text-dark">
                Home &nbsp;
              </a>
              / { title }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumb;
