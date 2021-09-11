import React from 'react';

function SearchBox({ searchPlaceholder }) {
  return (
    <div className="search-container">
      <input type="text" className="search-box" placeholder={searchPlaceholder}></input>
      <span className="icon-search"></span>
    </div>
  );
}

export default SearchBox;
