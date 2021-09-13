import React, { useCallback, useEffect, useState } from 'react';
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

function List({ data, load, pageSize, searchAt, searchPlaceholder, searchType, sortDirection, sortOn, type }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');

  const sort = useCallback(
    (items) => {
      const canSort =
        items &&
        items.length > 0 &&
        sortDirection &&
        ['asc', 'desc'].indexOf(sortDirection.toString().toLowerCase()) >= 0 &&
        sortOn &&
        items[0].hasOwnProperty(sortOn.toString());

      if (canSort) {
        const sortedItems = items.map((item) => item);
        sortedItems.sort((item1, item2) => {
          const val1 = item1[sortOn];
          const val2 = item2[sortOn];
          if (typeof val1 === 'string') {
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

  const loadData = useCallback(() => {
    let sortedData = [];
    const config = {
      pageNumber,
      pageSize,
      searchText,
    };

    setLoading(true);
    load(config)
      .then((data) => {
        sortedData = sort(data);
        setList(sortedData);
        setCurrentList(sortedData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        throw new Error('Error in fetching data. check your load function');
      });
  }, [load, pageNumber, pageSize, searchText, sort]);

  useEffect(() => {
    if (!data && !load) {
      throw new Error('Either data or load function is required.');
    }

    let sortedData = [];
    if (data) {
      sortedData = sort(data);
      setList(sortedData);
      setCurrentList(sortedData);
    } else if (load) {
      loadData();
    }
  }, [loadData, data, load, sort]);

  const setSelected = (key) => {
    let updatedList = list.map((li) => {
      if (type.toString().toLowerCase() === 'single-select' && li.isSelected) {
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

  const searchCallback = (event) => {
    setSearchText(event.target.value.toLowerCase());

    if (searchAt && searchAt.toString().toLowerCase() === 'server') {
      setPageNumber(1);
      loadData();
    } else {
      const matches = list.filter((item) => {
        if (searchType && searchType === 'startsWith') {
          return item.caption.toLowerCase().startsWith(searchText);
        }

        if (searchType && searchType === 'endsWith') {
          return item.caption.toLowerCase().endsWith(searchText);
        }

        return item.caption.toLowerCase().includes(searchText);
      });

      setCurrentList(matches);
    }
  };

  return (
    <div className={`list-group ${loading ? 'loading' : ''}`}>
      {loading && <BusyIndicator></BusyIndicator>}
      {!loading && (
        <>
          <SearchBox {...{ searchPlaceholder, searchCallback }}></SearchBox>
          <div className='list-items'>
            {currentList.map((item) => {
              return <ListItem key={item.key} {...{ item, setSelected }}></ListItem>;
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default List;
