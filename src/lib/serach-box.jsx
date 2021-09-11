import React from 'react';

function SearchBox({ searchPlaceholder, searchCB }) {
  return (
    <div className='search-container'>
      <input type='text' className='search-box' placeholder={searchPlaceholder} onKeyUp={searchCB}></input>
      <span className='icon-search'></span>
    </div>
  );
}

export default SearchBox;
