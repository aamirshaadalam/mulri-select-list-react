import React, { useCallback, useEffect, useState, useRef } from 'react';
import ListItem from './list-item';
import SearchBox from './search-box';
import BusyIndicator from './busy-indicator';
import '../css/list.scss';

const sortDirections = ['asc', 'desc'];
const STARTS_WITH = 'startsWith';
const ENDS_WITH = 'endsWith';
const STRING = 'string';
const ENTER = 'Enter';
const DESC = 'desc';
const NO_RECORDS = 'No Records';

const compare = (value1, value2, sortDirection) => {
  let result = 0;

  if (value1 < value2) {
    result = -1;
  }

  if (value1 > value2) {
    result = 1;
  }

  if (sortDirection && sortDirection.toLowerCase() === DESC) {
    return result * -1;
  }

  return result;
};

function List({
  data,
  loadCallback,
  pageSize,
  searchAtServer,
  searchPlaceholder,
  searchType,
  singleSelect,
  sortDirection,
  sortOn,
  noRecordsMessage,
}) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [lastPage, setLastPage] = useState(false);
  const [showFromSearch, setShowFromSearch] = useState(false);
  const scrollContainer = useRef(null);

  const sort = useCallback(
    (items) => {
      const canSort =
        items &&
        items.length > 0 &&
        sortDirection &&
        sortDirections.indexOf(sortDirection.toString().toLowerCase()) >= 0 &&
        sortOn &&
        items[0].hasOwnProperty(sortOn.toString());

      if (canSort) {
        const sortedItems = items.map((item) => item);
        sortedItems.sort((item1, item2) => {
          const val1 = item1[sortOn];
          const val2 = item2[sortOn];
          if (typeof val1 === STRING) {
            return compare(val1.toLowerCase(), val2.toLowerCase(), sortDirection);
          } else {
            return compare(val1, val2, sortDirection);
          }
        });
        return sortedItems;
      }
      return items || [];
    },
    [sortDirection, sortOn]
  );

  const loadData = useCallback(async () => {
    const config = {
      pageNumber,
      pageSize,
      searchText,
    };

    try {
      setLoading(true);
      let data = (await loadCallback(config)) || [];

      if (data.length < pageSize) {
        setLastPage(true);
      } else if (data.length === pageSize) {
        setLastPage(false);
      }

      if (pageNumber > 1) {
        setList((prevList) => sort([...prevList, ...data]));
      } else if (pageNumber === 1) {
        setList(sort(data));
      }

      setLoading(false);
    } catch (error) {
      setList([]);
      setLoading(false);
      throw new Error(error);
    }
  }, [loadCallback, pageNumber, pageSize, searchText, sort]);

  useEffect(() => {
    if (data) {
      setList(data);
    } else if (loadCallback) {
      loadData();
    }
  }, [data, loadCallback, loadData]);

  const updateSelections = useCallback(
    (key) => {
      const listMap = list.map((item) => {
        if (item.key === key) {
          item.isSelected = !item.isSelected;
        } else if (singleSelect && item.isSelected) {
          item.isSelected = false;
        }

        return item;
      });
      setList(listMap);
    },
    [list, singleSelect]
  );

  const search = (key, value) => {
    if (key === ENTER || !value) {
      if (searchAtServer && loadCallback) {
        setSearchText(value);
        setPageNumber(1);
      } else {
        if (!value) {
          setShowFromSearch(false);
          setSearchResults([]);
          setLastPage(false);
        } else {
          const filteredList = list.filter((item) => {
            switch (searchType) {
              case STARTS_WITH:
                return item.caption.toLowerCase().startsWith(value);
              case ENDS_WITH:
                return item.caption.toLowerCase().endsWith(value);
              default:
                return item.caption.toLowerCase().includes(value);
            }
          });

          if (pageSize && filteredList.length < pageSize) {
            setLastPage(true);
          } else {
            setLastPage(false);
          }

          setShowFromSearch(true);
          setSearchResults(filteredList);
        }
      }
    }
  };

  const handleScroll = useCallback(
    (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      const incrementPage = scrollTop + clientHeight >= scrollHeight - 5 && !lastPage && pageSize && !showFromSearch;

      if (incrementPage) {
        setPageNumber((prev) => prev + 1);
      }
    },
    [lastPage, pageSize, showFromSearch]
  );

  useEffect(() => {
    const div = scrollContainer.current;

    if (div) {
      scrollContainer.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (div) {
        div.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const getContent = () => {
    const displayList = showFromSearch ? searchResults : list;
    const showPageLoader = !lastPage && pageSize && !showFromSearch;

    if (loading && pageNumber === 1) {
      return (
        <div className='list-items center' ref={scrollContainer}>
          <BusyIndicator className='loading-icon32'></BusyIndicator>
        </div>
      );
    } else if (displayList.length > 0) {
      return (
        <div className='list-items' ref={scrollContainer}>
          {displayList.map((item) => {
            return <ListItem key={item.key} {...{ item, updateSelections }}></ListItem>;
          })}
          <div className={`loding-item ${!showPageLoader ? 'hidden' : ''}`}>
            <BusyIndicator className='loading-icon16'></BusyIndicator>
          </div>
        </div>
      );
    } else {
      return (
        <div className='list-items center' ref={scrollContainer}>
          <div>{noRecordsMessage || NO_RECORDS}</div>
        </div>
      );
    }
  };

  return (
    <div className='list-group'>
      <SearchBox {...{ searchPlaceholder, search, searchText }}></SearchBox>
      {getContent()}
    </div>
  );
}

export default List;
