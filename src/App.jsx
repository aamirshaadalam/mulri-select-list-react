import './css/App.css';
import List from './lib/list';
import data from './data/cities.json';

const PAGE_SIZE = 25;

const getData = (config) => {
  const { pageNumber, searchText } = config;
  let result = data;

  if (searchText) {
    result = data.filter((item) => {
      return item.caption.toLowerCase().includes(searchText);
    });
  }

  if (pageNumber > 0 && PAGE_SIZE) {
    const start = (pageNumber - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    result = result.slice(start, end);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, 3000);
  });
};

function App() {
  return <List loadCallback={getData} searchPlaceholder='Search..' singleSelect sortDirection='asc' sortOn='caption' searchAtServer></List>;
}

export default App;
