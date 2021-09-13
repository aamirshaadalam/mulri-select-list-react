import React from 'react';

function SearchBox({ searchPlaceholder, searchCallback }) {
  return (
    <div className='search-container'>
      <input type='text' className='search-box' placeholder={searchPlaceholder} onKeyUp={searchCallback}></input>
      <span className='icon-search'></span>
    </div>
  );
}

export default SearchBox;
