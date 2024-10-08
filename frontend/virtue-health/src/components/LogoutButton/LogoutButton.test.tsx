import React from 'react';
import { shallow } from 'enzyme';
import LogoutButton from './LogoutButton';

describe('<LogoutButton />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<LogoutButton />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
