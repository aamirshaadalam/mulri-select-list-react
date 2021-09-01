import React, { useState } from 'react';
import '../css/multi-select.scss';
import data from '../data/cities.json'

function MultiSelectList() {
  const [items, setItems] = useState(data);

  const toggleActive = (key) => {
    let updatedItems = items.map((item) => {
      if (item.key === key) {
        item.selected = !item.selected;
        return item;
      }
      return item;
    });

    setItems(updatedItems);
  };

  return (
    <div className="list-group">
      {items.map((item) => {
        let classString = `list-item ${item.selected ? 'active' : ''}`;

        return (
          <div key={item.key} className={classString} onClick={() => toggleActive(item.key)}>
            {item.caption}
          </div>
        );
      })}
    </div>
  );
}

export default MultiSelectList;
