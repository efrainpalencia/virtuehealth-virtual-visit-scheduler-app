import React from 'react';
import { shallow } from 'enzyme';
import DoctorDashboardLayout from './DoctorDashboardLayout';

describe('<DoctorDashboardLayout />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorDashboardLayout />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
