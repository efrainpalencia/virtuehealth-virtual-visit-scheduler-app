import React from "react";
import { Input, Space } from "antd";
import type { InputProps } from "antd/lib/input";

// Style for the search bar
const searchBarStyle: React.CSSProperties = {
  width: 300,
};

// Defining the props for SearchBar component
interface SearchBarProps extends InputProps {
  onSearch: (value: string) => void; // Callback for search action
  placeholder?: string; // Optional placeholder
}

const { Search } = Input;

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
}) => (
  <Space direction="vertical" style={searchBarStyle}>
    <Search
      placeholder={placeholder}
      onSearch={onSearch} // Pass the onSearch callback as a prop
      enterButton
    />
  </Space>
);

export default SearchBar;
