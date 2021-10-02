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

# How to use

# Props

### **captions**

- **Datatype:** `Object`
- **Description:** Used to customize the texts used in the `List` component. The following properties can be set to customize respective texts:
  - SEARCH_PLACEHOLDER: Placeholder text for the search box.
  - NO_DATA: The message to be displayed when the list is empty.
  - CLEAR_ALL: The button text for `Clear Selections` button.
  - CLEAR_TOOLTIP: Tooltip for the `Clear` icon.
  - SEARCH_TOOLTIP: Tooltip for `Search` icon.

### **data**

- **Datatype:** `Array<Objects>`
- **Description:** List of items to be displayed. This is an optional prop but, either `data` or `onLoad` is required. Use this to display a static list.

### **onLoad**

- **Datatype:** `Function`
- **Description:** Function to be called to fetch the list. This is an optional prop but, either `data` or `onLoad` is required. Use this to display a dynamic list.

### **onSelectionsChange**

- **Datatype:** `Function`
- **Description:** A callback function to be called whenever there is a change in selected items.

### **pageSize**

- **Datatype:** `Number`
- **Description:** Size of the each page if the list is paginated. The component only supports server side pagination. Hence, this prop will be ignored for static list.

### **searchType**

- **Datatype:** `String`
- **Description:** Type of search for static list. This prop will be ignored for server side search. The default `searchType` is `includes` and you can ignore this prop if you want to use the default search type. The other valid values are `startsWith` and `endsWith`.

### **singleSelect**

- **Datatype:** `Boolean`
- **Description:** Behavior of the `List`. The default behavior is multi select. Ignore this prop if your list is multi select. For single select lists, specify `singleSelect` as an attribute.

### **sortDirection**

- **Datatype:** `String`
- **Description:** Sort direction for the list items if the list should appear in sorted order. The valid values are `asc` and `desc`.

### **sortOn**

- **Datatype:** `String`
- **Description:** The sort column. This is the column whose value should be considered while sorting the list.

### **totalPages**

- **Datatype:** `Number`
- **Description:** Total number of pages. This required if the list should support pagination. The component only supports server side pagination and this property will be ignored for static lists.

> **Note:** `totalPages`, `pageSize` and `onLoad` props are required for dynamic list, server side search and pagination.
