import React from 'react';
import { shallow } from 'enzyme';
import MainLayout from './MainLayout';

describe('<MainLayout />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<MainLayout />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
