import React from 'react';
import { shallow } from 'enzyme';
import DoctorDetails from './DoctorDetails';

describe('<DoctorDetails />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorDetails />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
