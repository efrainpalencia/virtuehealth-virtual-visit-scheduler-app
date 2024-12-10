import React from 'react';
import { shallow } from 'enzyme';
import ProtectedRoute from './ProtectedRoute';

describe('<ProtectedRoute />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<ProtectedRoute />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
