import React, { useCallback, useEffect, useState, useRef } from 'react';
import ListItem from './list-item';
import SearchBox from './search-box';
import BusyIndicator from './busy-indicator';
import '../css/list.scss';

const compare = (value1, value2, sortDirection) => {
  let result = 0;

  if (value1 < value2) {
    result = -1;
  }

  if (value1 > value2) {
    result = 1;
  }

  if (sortDirection && sortDirection.toLowerCase() === 'desc') {
    return result * -1;
  }

  return result;
};

const sortDirections = ['asc', 'desc'];
const STARTS_WITH = 'startsWith';
const ENDS_WITH = 'endsWith';
const STRING = 'string';

function List({ data, loadCallback, pageSize, searchAtServer, searchPlaceholder, searchType, singleSelect, sortDirection, sortOn }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [lastPage, setLastPage] = useState(false);
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
        setCurrentList((prevList) => sort([...prevList, ...data]));
      } else if (pageNumber === 1) {
        setList(sort(data));
        setCurrentList(sort(data));
      }

      setLoading(false);
    } catch (error) {
      setList([]);
      setCurrentList([]);
      setLoading(false);
      throw new Error('Error in fetching data.');
    }
  }, [loadCallback, pageNumber, pageSize, searchText, sort]);

  useEffect(() => {
    if (data) {
      setList(data);
      setCurrentList(data);
    } else if (loadCallback) {
      loadData();
    }
  }, [data, loadCallback, loadData]);

  const setSelected = (key) => {
    let updatedList = list.map((li) => {
      if (singleSelect && li.isSelected) {
        li.isSelected = false;
      }

      if (li.key === key) {
        li.isSelected = !li.isSelected;
        return li;
      }

      return li;
    });

    setCurrentList(updatedList);
  };

  const searchCallback = (key, value) => {
    if (key === 'Enter' || !value) {
      setSearchText(value);

      if (searchAtServer && loadCallback) {
        setPageNumber(1);
      } else {
        const matches = list.filter((item) => {
          if (searchType && searchType === STARTS_WITH) {
            return item.caption.toLowerCase().startsWith(searchText);
          }

          if (searchType && searchType === ENDS_WITH) {
            return item.caption.toLowerCase().endsWith(searchText);
          }

          return item.caption.toLowerCase().includes(searchText);
        });

        setCurrentList(matches);
      }
    }
  };

  const handleScroll = useCallback(
    (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;

      if (scrollTop + clientHeight >= scrollHeight - 5 && !lastPage) {
        setPageNumber((prev) => prev + 1);
      }
    },
    [lastPage]
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

  return (
    <div className='list-group'>
      <SearchBox {...{ searchPlaceholder, searchCallback, searchText }}></SearchBox>
      <div className={`list-items ${loading && pageNumber === 1 ? 'loading' : ''}`} ref={scrollContainer}>
        {loading && pageNumber === 1 && <BusyIndicator className='loading-icon32'></BusyIndicator>}
        {!(loading && pageNumber === 1) && (
          <>
            {currentList.map((item) => {
              return <ListItem key={item.key} {...{ item, setSelected }}></ListItem>;
            })}
            <div className={`loding-item ${lastPage ? 'hidden' : ''}`}>
              <BusyIndicator className='loading-icon16'></BusyIndicator>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default List;
