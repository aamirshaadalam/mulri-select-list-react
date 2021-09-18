import React, { useState, useRef } from 'react';

function SearchBox({ searchPlaceholder, search, searchText }) {
  const [searchTerm, setSearchTerm] = useState(searchText);
  const input = useRef(null);

  const setFocus = () => {
    if (input.current) {
      input.current.focus();
    }
  };

  return (
    <div className='search-container'>
      <input
        type='text'
        className='search-box'
        placeholder={searchPlaceholder}
        onKeyUp={(e) => search(e.key, searchTerm)}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        ref={input}></input>
      <span className='icon-search' onClick={setFocus}></span>
    </div>
  );
}

export default SearchBox;
