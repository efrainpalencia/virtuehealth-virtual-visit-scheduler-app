import React from 'react';
import { shallow } from 'enzyme';
import DoctorSchedule from './DoctorSchedule';

describe('<DoctorSchedule />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorSchedule />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
