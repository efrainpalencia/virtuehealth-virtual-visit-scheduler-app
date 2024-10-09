import React from 'react';
import { shallow } from 'enzyme';
import LogoutPage from './LogoutPage';

describe('<LogoutPage />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<LogoutPage />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
