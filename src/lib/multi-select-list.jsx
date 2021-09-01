import React, { useState } from 'react';
import '../css/multi-select.scss';

function MultiSelectList() {
  const [items, setItems] = useState([
    {
      caption: 'Item1',
      defaultCaption: 'Item1',
      selected: true,
      key: '1',
    },
    {
      caption: 'Item2',
      defaultCaption: 'Item2',
      selected: false,
      key: '2',
    },
    {
      caption: 'Item3',
      defaultCaption: 'Item3',
      selected: true,
      key: '3',
    },
    {
      caption: 'Item4',
      defaultCaption: 'Item4',
      selected: false,
      key: '4',
    },
    {
      caption: 'Item5',
      defaultCaption: 'Item5',
      selected: true,
      key: '5',
    },
  ]);

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
