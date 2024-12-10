import React from 'react';
import { shallow } from 'enzyme';
import SearchBar from './SearchBar';

describe('<SearchBar />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<SearchBar />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
