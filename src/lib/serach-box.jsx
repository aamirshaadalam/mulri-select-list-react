import React from 'react';

function SearchBox({ serachText }) {
  return (
    <div className="search-container">
      <input type="text" className="search-box" placeholder={serachText}></input>
      <span className="icon-search"></span>
    </div>
  );
}

export default SearchBox;
