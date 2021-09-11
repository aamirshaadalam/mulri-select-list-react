import './css/App.css';
import List from './lib/list';
import data from './data/cities.json';

const getData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 2000);
  });
};

function App() {
  return <List load={getData} searchPlaceholder="Search.." type="single-select" sortDirection="asc" sortOn="caption"></List>;
}

export default App;
