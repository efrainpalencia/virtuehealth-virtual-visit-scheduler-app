import React from 'react';
import { shallow } from 'enzyme';
import RequireAuth from './RequireAuth';

describe('<RequireAuth />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<RequireAuth />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
