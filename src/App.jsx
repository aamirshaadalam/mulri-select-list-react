import './css/App.css';
import List from './lib/list';
import data from './data/cities.json';

const getData = (config) => {
  const { pageNumber, searchText, pageSize } = config;
  let result = data;

  console.log(`Total number of records: ${data.length}`);

  if (searchText) {
    result = data.filter((item) => {
      return item.caption.toLowerCase().includes(searchText);
    });
  }

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

function App() {
  return (
    <List loadCallback={getData} searchPlaceholder='Search..' singleSelect noRecordsMessage='No Records Found' pageSize={25} totalPages={40}></List>
  );
}

export default App;
