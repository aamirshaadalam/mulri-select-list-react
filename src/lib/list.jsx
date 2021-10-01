import React, { useCallback, useEffect, useState, useRef } from 'react';
import ListItem from './list-item';
import SearchBox from './search-box';
import BusyIndicator from './busy-indicator';
import '../css/list.scss';
import usePrevious from '../hooks/use-previous';

const sortDirections = ['asc', 'desc'];
const STARTS_WITH = 'startsWith';
const ENDS_WITH = 'endsWith';
const STRING = 'string';
const ENTER = 'Enter';
const DESC = 'desc';
const NO_DATA = 'No Records Found';
const SEARCH_PLACEHOLDER = 'Search...';
const CLEAR_ALL = 'Clear Selections';
const CLEAR_TOOLTIP = 'Clear';
const SEARCH_TOOLTIP = 'Search';

const compare = (value1, value2, sortDirection) => {
  let result = 0;

  if (value1 < value2) {
    result = -1;
  }

  if (value1 > value2) {
    result = 1;
  }

  if (sortDirection && sortDirection.toLowerCase() === DESC) {
    return result * -1;
  }

  return result;
};

function List({
  captions,
  data,
  onLoad,
  onSelectionsChange,
  pageSize,
  searchType,
  singleSelect,
  sortDirection,
  sortOn,
  totalPages,
}) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [localSearch, setLocalSearch] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const loadMore = useRef(null);
  const prevConfig = usePrevious({
    pageNumber,
    pageSize,
    searchText,
  });
  const resources = {
    SEARCH_PLACEHOLDER: captions ? captions.SEARCH_PLACEHOLDER || SEARCH_PLACEHOLDER : SEARCH_PLACEHOLDER,
    NO_DATA: captions ? captions.NO_DATA || NO_DATA : NO_DATA,
    CLEAR_ALL: captions ? captions.CLEAR_ALL || CLEAR_ALL : CLEAR_ALL,
    CLEAR_TOOLTIP: captions ? captions.CLEAR_TOOLTIP || CLEAR_TOOLTIP : CLEAR_TOOLTIP,
    SEARCH_TOOLTIP: captions ? captions.SEARCH_TOOLTIP || SEARCH_TOOLTIP : SEARCH_TOOLTIP,
  };

  const sort = useCallback(
    (items) => {
      const canSort =
        items &&
        items.length > 0 &&
        sortDirection &&
        sortDirections.indexOf(sortDirection.toString().toLowerCase()) >= 0 &&
        sortOn &&
        items[0].hasOwnProperty(sortOn.toString());

      if (canSort) {
        const sortedItems = items.map((item) => item);
        sortedItems.sort((item1, item2) => {
          const val1 = item1[sortOn];
          const val2 = item2[sortOn];
          if (typeof val1 === STRING) {
            return compare(val1.toLowerCase(), val2.toLowerCase(), sortDirection);
          } else {
            return compare(val1, val2, sortDirection);
          }
        });
        return sortedItems;
      }
      return items || [];
    },
    [sortDirection, sortOn]
  );

  const preventRender = useCallback(() => {
    return (
      prevConfig &&
      prevConfig.pageSize === pageSize &&
      prevConfig.searchText.toLowerCase() === searchText.toLowerCase() &&
      (prevConfig.pageNumber === pageNumber || pageNumber > totalPages)
    );
  }, [prevConfig, pageSize, searchText, pageNumber, totalPages]);

  const loadData = useCallback(async () => {
    const config = {
      pageNumber,
      pageSize,
      searchText,
    };

    if (preventRender()) {
      return;
    }

    try {
      setLoading(true);
      const data = (await onLoad(config)) || [];

      data.forEach((item) => {
        if (selectedItems.indexOf(item.key) === -1 && item.isSelected) {
          item.isSelected = false;
        } else if (selectedItems.indexOf(item.key) !== -1) {
          item.isSelected = true;
        }
      });

      if (pageNumber > 1) {
        setList((prevList) => sort([...prevList, ...data]));
      } else if (pageNumber === 1) {
        setList(sort(data));
      }

      setLoading(false);
    } catch (error) {
      setList([]);
      setLoading(false);
      throw new Error(error);
    }
  }, [onLoad, pageNumber, pageSize, searchText, sort, preventRender, selectedItems]);

  const updateSelections = useCallback(
    (key) => {
      const listMap = list.map((item) => {
        if (item.key === key) {
          item.isSelected = !item.isSelected;
        } else if (singleSelect && item.isSelected) {
          item.isSelected = false;
        }

        return item;
      });

      setList(listMap);
      let filteredSelections = selectedItems.filter((itemKey) => itemKey !== key);

      if (filteredSelections.length === selectedItems.length) {
        filteredSelections.push(key);
      }

      setSelectedItems(filteredSelections);
      onSelectionsChange(filteredSelections);
    },
    [list, singleSelect, selectedItems, onSelectionsChange]
  );

  const clearSelections = () => {
    const listMap = list.map((item) => {
      item.isSelected = false;
      return item;
    });
    setList(listMap);
    setSelectedItems([]);
    onSelectionsChange([]);
  };

  const search = (key, value) => {
    if (key === ENTER || !value) {
      if (pageSize && totalPages && onLoad) {
        setSearchText(value || '');
        setPageNumber(1);
      } else {
        if (!value) {
          setLocalSearch(false);
          setSearchResults([]);
        } else {
          const filteredList = list.filter((item) => {
            switch (searchType) {
              case STARTS_WITH:
                return item.caption.toLowerCase().startsWith(value);
              case ENDS_WITH:
                return item.caption.toLowerCase().endsWith(value);
              default:
                return item.caption.toLowerCase().includes(value);
            }
          });

          setLocalSearch(true);
          setSearchResults(filteredList);
        }
      }
    }
  };

  const addButtons = (displayList) => {
    if (displayList.length > 0 && !singleSelect) {
      return (
        <div className='btn-container'>
          <button onClick={clearSelections}>{resources.CLEAR_ALL}</button>
        </div>
      );
    }

    return null;
  };

  const getContent = () => {
    const displayList = localSearch ? searchResults : list;
    const showPageLoader = totalPages && pageSize && !localSearch && pageNumber < totalPages;
    let pageLoaderClass = 'loading-item';

    if (!showPageLoader) {
      pageLoaderClass = `${pageLoaderClass} hidden`;
    }

    if (loading && pageNumber === 1) {
      return (
        <div className='list-items center'>
          <BusyIndicator className='loading-icon32'></BusyIndicator>
        </div>
      );
    } else if (displayList.length > 0) {
      return (
        <>
          {addButtons(displayList)}
          <div className={`list-items ${!singleSelect ? 'multi' : ''}`}>
            {displayList.map((item) => {
              return <ListItem key={item.key} {...{ item, updateSelections }}></ListItem>;
            })}
            <div className={pageLoaderClass} ref={loadMore}>
              <BusyIndicator className='loading-icon16'></BusyIndicator>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className='list-items center'>
          <div className='no-data'>{resources.NO_DATA}</div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (data) {
      setList(data);
    } else if (onLoad) {
      loadData();
    }
  }, [data, onLoad, loadData]);

  useEffect(() => {
    const target = loadMore.current;
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && !loading && pageSize && totalPages && pageNumber < totalPages) {
        setPageNumber((prev) => prev + 1);
      }
    }, options);

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        return observer.unobserve(target);
      }
    };
  }, [loading, loadMore, pageNumber, pageSize, totalPages]);

  return (
    <div className='list-group'>
      <SearchBox
        placeholder={resources.SEARCH_PLACEHOLDER}
        clearTitle={resources.CLEAR_TOOLTIP}
        searchTitle={resources.SEARCH_TOOLTIP}
        {...{ search, searchText }}></SearchBox>
      {getContent()}
    </div>
  );
}

export default List;
