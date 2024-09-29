import React from 'react';
import { shallow } from 'enzyme';
import Register from './Register';

describe('<Register />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Register />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
