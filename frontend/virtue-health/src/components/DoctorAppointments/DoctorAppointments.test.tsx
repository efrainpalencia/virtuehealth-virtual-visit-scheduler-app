import React from 'react';
import { shallow } from 'enzyme';
import DoctorAppointments from './DoctorAppointments';

describe('<DoctorAppointments />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorAppointments />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
