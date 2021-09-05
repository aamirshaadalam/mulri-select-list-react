import './css/App.css';
import MultiSelectList from './lib/multi-select-list';
import data from './data/cities.json';

const getData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 2000);
  });
};

function App() {
  return <MultiSelectList load={getData}></MultiSelectList>;
}

export default App;
