import React from 'react';

function SearchBox({ searchText }) {
  return (
    <div className="search-container">
      <input type="text" className="search-box" placeholder={searchText}></input>
      <span className="icon-search"></span>
    </div>
  );
}

export default SearchBox;
