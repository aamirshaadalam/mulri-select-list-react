import React, { useState, useRef } from 'react';

function SearchBox({ clearTitle, placeholder, search, searchText, searchTitle }) {
  const [searchTerm, setSearchTerm] = useState(searchText);
  const input = useRef(null);

  const setFocus = () => {
    if (input.current) {
      input.current.focus();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    search('');
    setFocus();
  };

  return (
    <div className='search-container'>
      <input
        type='text'
        className='search-box'
        placeholder={placeholder}
        onKeyUp={(e) => search(e.key, searchTerm)}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        ref={input}></input>
      <span className='icon-search' onClick={setFocus} title={searchTitle}></span>
      <span className={`icon-clear ${!searchTerm ? 'hidden' : ''}`} onClick={clearSearch} title={clearTitle}></span>
    </div>
  );
}

export default SearchBox;
