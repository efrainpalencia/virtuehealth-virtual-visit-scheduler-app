import React from "react";
import { Input, Space } from "antd";
import type { GetProps } from "antd";

const searchBarStyle: React.CSSProperties = {
  width: 300,
};

type SearchBarProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const onSearch: SearchBarProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

const SearchBar: React.FC = () => (
  <Space direction="vertical" style={searchBarStyle}>
    <Search placeholder="input search text" onSearch={onSearch} enterButton />
  </Space>
);

export default SearchBar;
