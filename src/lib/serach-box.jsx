import React from 'react';

function SearchBox({ placeholderText }) {
  return (
    <div className="search-container">
      <input type="text" className="search-box" placeholder={placeholderText}></input>
      <span class="icon-search"></span>
    </div>
  );
}

export default SearchBox;
