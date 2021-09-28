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

    console.log(`Total number of records: ${data.length}`);

    if (searchText) {
      result = data.filter((item) => {
        return item.caption.toLowerCase().includes(searchText);
      });
    }

    computePageCount(result, pageSize);

    if (pageNumber > 0 && pageSize) {
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

  return (
    <List
      loadCallback={getData}
      searchPlaceholder='Search..'
      noRecordsMessage='No Records Found'
      pageSize={25}
      totalPages={totalPages}
      searchAtServer></List>
  );
}

export default App;
