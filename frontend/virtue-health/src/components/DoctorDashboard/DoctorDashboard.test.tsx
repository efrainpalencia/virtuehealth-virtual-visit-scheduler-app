import React from 'react';
import { shallow } from 'enzyme';
import DoctorDashboard from './DoctorDashboard';

describe('<DoctorDashboard />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorDashboard />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
