# List

`List` is a React component that can be used to display a list of items in any React application.

This component offers following features:

- Display a static list
- Display a dynamic list
- Single select
- Multi select
- Server side search
- Client side search
- Server side pagination with infinite scroll
- Sort the given list
- Clear all selections
- Custom captions that can be used to localize texts used in the component.

> **Note:** `Search` is triggered on the press of `Enter` key.

# Usage

# Props

### **captions**

- **Type:** `Object`
- **Description:** Customize texts used in the `List` component. The following properties can be set to customize respective texts:

  - SEARCH_PLACEHOLDER: Placeholder text for the search box.
  - NO_DATA: The message to be displayed when the list is empty.
  - CLEAR_ALL: The button text for `Clear Selections` button.
  - CLEAR_TOOLTIP: Tooltip for the `Clear` icon.
  - SEARCH_TOOLTIP: Tooltip for `Search` icon.

  ```javascript
  // Sample object for 'captions'

  {
      SEARCH_PLACEHOLDER: 'Search...',
      NO_DATA: 'No Records Found',
      CLEAR_ALL: 'Clear Selections',
      CLEAR_TOOLTIP: 'Clear',
      SEARCH_TOOLTIP: 'Search',
  }
  ```

### **comparisonType**

- **Type:** `String`
- **Description:** The comparison method used to compare the searched term with the items in list while performing client-side search. This prop will be ignored for server-side search. The default value for `comparisonType` is `includes` and you can ignore this prop if you want to use the default comparison type. The other valid values are `startsWith` and `endsWith`.

### **data**

- **Type:** `Array<Object>`
- **Description:** List of items to be displayed. This is an optional prop but, either `data` or `onLoad` is required. Use this to display a static list.

### **onLoad**

- **Type:** `Function`
- **Description:** Function to fetch list data. This is an optional prop but, either `data` or `onLoad` is required. Use this to display a dynamic list.
- **Usage:**

  - Fetch list data.
  - Perform server side search.

- **Return Type:** `Promise<Array<Object>>`

  > **Note:** `Object` must have `caption` and `key` properties as shown below.

  ```javascript
  // Structure of object

  {
      caption: 'item caption',
      key: 1234, // can be number or string, should be unique
      ...
  }
  ```

- **Parameters:** `config`

  ```javascript
  // structure of 'config'

  {
    pageNumber: '<page number>',
    searchText: '<search term>',
    pageSize: '<page size>'
  }

  // Calling 'onLoad' function
  const data = await onLoad(config)
  ```

### **onSelectionsChange**

- **Type:** `Function`
- **Description:** A callback function to be called whenever there is a change in selections.
- **Usage:**
  - Pass list of selected items to the consumer.
- **Return Type:** `NA`
- **Parameters:** `selectedItems`

  ```javascript
  // Structure of 'selectedItems' (array of list item keys)
  const selectedItems = [123, 456, 789];

  // Calling 'onSelectionsChange' function
  onSelectionsChange(selectedItems);
  ```

### **pageSize**

- **Type:** `Number`
- **Description:** Size of the each page if the list is paginated. The component only supports server side pagination. Hence, this prop will be ignored for static list.

### **singleSelect**

- **Type:** `Boolean`
- **Description:** Behavior of the `List`. The default behavior is multi select. Ignore this prop if your list is multi select. For single select lists, specify `singleSelect` as an attribute.

### **sortDirection**

- **Type:** `String`
- **Description:** Sort direction for the list items if the list should appear in sorted order. The valid values are `asc` and `desc`.

### **sortOn**

- **Type:** `String`
- **Description:** The sort column. This is the column whose value should be considered while sorting the list (belongs to list item object).

### **totalPages**

- **Type:** `Number`
- **Description:** Total number of pages. This required if the list should support pagination. The component only supports server side pagination and this property will be ignored for static lists.

> **Note:** The required properties for the following features are listed beside each feature:
>
> - Dynamic list (`onLoad`).
> - Server side search (`totalPages`, `pageSize`, `onLoad`).
> - Pagination (`totalPages`, `pageSize`, `onLoad`).
