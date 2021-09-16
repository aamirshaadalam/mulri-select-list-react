import React, { useState } from 'react';

function SearchBox({ searchPlaceholder, searchCallback, searchText }) {
  const [searchTerm, setSearchTerm] = useState(searchText);

  return (
    <div className='search-container'>
      <input
        type='text'
        className='search-box'
        placeholder={searchPlaceholder}
        onKeyUp={(e) => searchCallback(e.key, searchTerm)}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}></input>
      <span className='icon-search'></span>
    </div>
  );
}

export default SearchBox;
