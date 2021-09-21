import React from 'react';

function ListItem({ item, updateSelections }) {
  const classString = `list-item ${item.isSelected ? 'active' : ''}`;

  return (
    <div className={classString} onClick={() => updateSelections(item.key)}>
      {item.caption}
    </div>
  );
}

export default ListItem;
