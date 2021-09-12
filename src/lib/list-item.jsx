import React from 'react';

function ListItem({ item, setSelected }) {
  const classString = `list-item ${item.isSelected ? 'active' : ''}`;

  return (
    <div className={classString} onClick={() => setSelected(item.key)}>
      {item.caption}
    </div>
  );
}

export default ListItem;
