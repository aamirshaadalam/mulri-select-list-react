import React, { useEffect, useState } from 'react';
import '../css/multi-select.scss';

function MultiSelectList({ data, load, type }) {
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

  return (
    <div className="list-group">
      {list.map((item) => {
        let classString = `list-item ${item.isSelected ? 'active' : ''}`;

        return (
          <div key={item.key} className={classString} onClick={() => setActive(item.key)}>
            {item.caption}
          </div>
        );
      })}
    </div>
  );
}

export default MultiSelectList;
