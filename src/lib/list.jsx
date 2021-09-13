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

  const loadData = useCallback(() => {
    let sortedData = [];
    const config = {
      pageNumber,
      pageSize,
      searchText,
    };

    setLoading(true);
    loadCallback(config)
      .then((data) => {
        sortedData = sort(data);
        setList(sortedData);
        setCurrentList(sortedData);
        setLoading(false);
      })
      .catch(() => {
        setList([]);
        setCurrentList([]);
        setLoading(false);
        throw new Error('Error in fetching data.');
      });
  }, [loadCallback, pageNumber, pageSize, searchText, sort]);

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

  const searchCallback = (event) => {
    setSearchText(event.target.value.toLowerCase());

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
