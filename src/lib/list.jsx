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

function List({ data, loadCallback, searchAtServer, searchPlaceholder, searchType, singleSelect, sortDirection, sortOn }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const loader = useRef(null);

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
      return items;
    },
    [sortDirection, sortOn]
  );

  const loadData = useCallback(async () => {
    let sortedData = [];
    const config = {
      pageNumber,
      searchText,
    };

    try {
      setLoading(true);
      const data = await loadCallback(config);
      sortedData = sort(data);
      setList(sortedData);
      setCurrentList(sortedData);
      setLoading(false);
    } catch (error) {
      setList([]);
      setCurrentList([]);
      setLoading(false);
      throw new Error('Error in fetching data.');
    }
  }, [loadCallback, pageNumber, searchText, sort]);

  useEffect(() => {
    let sortedData = [];

    if (data) {
      sortedData = sort(data);
      setList(sortedData);
      setCurrentList(sortedData);
    } else if (loadCallback) {
      loadData();
    }
  }, [data, loadCallback, loadData, sort]);

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
    if (key === 'Enter') {
      setSearchText(value);

      if (searchAtServer) {
        setPageNumber(1);
        loadData();
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

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };

    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setPageNumber((prev) => prev + 1);
      }
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) {
      observer.observe(loader.current);
    }
  });

  return (
    <div className='list-group'>
      <SearchBox {...{ searchPlaceholder, searchCallback, searchText }}></SearchBox>
      <div className={`list-items ${loading ? 'loading' : ''}`}>
        {loading && <BusyIndicator className='loading-icon32'></BusyIndicator>}
        {!loading && (
          <>
            {currentList.map((item) => {
              return <ListItem key={item.key} {...{ item, setSelected }}></ListItem>;
            })}
            <div className='loding-item'>
              <BusyIndicator className='loading-icon16'></BusyIndicator>
            </div>
            <div ref={loader} />
          </>
        )}
      </div>
    </div>
  );
}

export default List;
