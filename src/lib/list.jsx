import React, { useCallback, useEffect, useState } from 'react';
import ListItem from './list-item';
import SearchBox from './serach-box';
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

function List({ data, load, type, searchPlaceholder, sortDirection, sortOn, searchType }) {
  const [list, setList] = useState([]);
  const [currentList, setCurrentList] = useState([]);

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

  useEffect(() => {
    if (!type || ['single-select', 'multi-select'].indexOf(type.toString().toLowerCase()) === -1) {
      throw new Error(`Invalid property: type.`);
    }
  }, [type]);

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
      load()
        .then((data) => {
          sortedData = sort(data);
          setList(sortedData);
          setCurrentList(sortedData);
        })
        .catch(() => {
          throw new Error('Error in fetching data. check your load function');
        });
    }
  }, [data, load, sort]);

  const setActive = (key) => {
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

  const isEmptyList = () => {
    return !list || list.length === 0;
  };

  const searchCB = (event) => {
    const serachText = event.target.value.toLowerCase();

    const matches = list.filter((item) => {
      if (searchType && searchType === 'startsWith') {
        return item.caption.toLowerCase().startsWith(serachText);
      }

      if (searchType && searchType === 'endsWith') {
        return item.caption.toLowerCase().endsWith(serachText);
      }

      return item.caption.toLowerCase().includes(serachText);
    });

    setCurrentList(matches);
  };

  return (
    <div className={`list-group ${isEmptyList() ? 'loading' : ''}`}>
      {isEmptyList() && <BusyIndicator></BusyIndicator>}
      {!isEmptyList() && <SearchBox {...{ searchPlaceholder, searchCB }}></SearchBox>}
      {!isEmptyList() && (
        <div className='list-items'>
          {currentList.map((item) => {
            return <ListItem key={item.key} {...{ item, setActive }}></ListItem>;
          })}
        </div>
      )}
    </div>
  );
}

export default List;
