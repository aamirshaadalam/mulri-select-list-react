import './css/App.css';
import List from './lib/list';
import data from './data/cities.json';
import { useState } from 'react/cjs/react.development';

function App() {
  const [totalPages, setTotalPages] = useState(0);

  const computePageCount = (result, pageSize) => {
    let pages = result.length / pageSize;

    if (result.length % pageSize === 0) {
      setTotalPages(pages);
    } else {
      setTotalPages(pages + 1);
    }
  };

  const getData = (config) => {
    const { pageNumber, searchText, pageSize } = config;
    let result = data;

    console.log(JSON.stringify(config));

    if (searchText) {
      result = data.filter((item) => {
        return item.caption.toLowerCase().includes(searchText);
      });
    }

    if (pageNumber && pageSize) {
      computePageCount(result, pageSize);
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      result = result.slice(start, end);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
      }, 1000);
    });
  };

  const selectionsChanged = (selectedItems) => {
    console.log(selectedItems);
  };

  const captions = {
    SEARCH_PLACEHOLDER: 'Search...',
    NO_DATA: 'No Records Found',
    CLEAR_ALL: 'Clear Selections',
    CLEAR_TOOLTIP: 'Clear',
    SEARCH_TOOLTIP: 'Search',
  };

  return (
    <List
      onLoad={getData}
      onSelectionsChange={selectionsChanged}
      captions={captions}
      pageSize={100}
      totalPages={totalPages}
      sortDirection='asc'
      sortOn='caption'></List>
  );
}

export default App;
