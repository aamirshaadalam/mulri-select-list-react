import React, { useEffect, useState } from 'react';
import ListItem from './list-item';
import SearchBox from './serach-box';
import BusyIndicator from './busy-indicator';
import '../css/multi-select.scss';

function MultiSelectList({ data, load, type, searchText }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!data && !load) {
      throw new Error('Either data or load function is required.');
    }

    if (data) {
      setList(data);
    } else if (load) {
      load()
        .then((data) => {
          setList(data);
        })
        .catch(() => {
          throw new Error('Error in fetching data. check your load function');
        });
    }
  }, [data, load]);

  const setActive = (key) => {
    let updatedList = list.map((li) => {
      if (type && type === 'single-select' && li.isSelected) {
        li.isSelected = false;
      }

      if (li.key === key) {
        li.isSelected = !li.isSelected;
        return li;
      }

      return li;
    });

    setList(updatedList);
  };

  const isEmptyList = () => {
    return !list || list.length === 0;
  };

  return (
    <div className={`list-group ${isEmptyList() ? 'loading' : ''}`}>
      {isEmptyList() && <BusyIndicator></BusyIndicator>}
      {!isEmptyList() && <SearchBox {...{ searchText }}></SearchBox>}
      {!isEmptyList() &&
        list.map((item) => {
          return <ListItem key={item.key} {...{ item, setActive }}></ListItem>;
        })}
    </div>
  );
}

export default MultiSelectList;
