import React from 'react';

function ListItem({ item, setActive }) {
  const classString = `list-item ${item.isSelected ? 'active' : ''}`;

  return (
    <div className={classString} onClick={() => setActive(item.key)}>
      {item.caption}
    </div>
  );
}

export default ListItem;
