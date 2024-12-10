import React from 'react';
import { shallow } from 'enzyme';
import PatientAppointments from './PatientAppointments';

describe('<PatientAppointments />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientAppointments />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
