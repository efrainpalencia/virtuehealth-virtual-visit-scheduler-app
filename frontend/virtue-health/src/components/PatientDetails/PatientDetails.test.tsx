import React from 'react';
import { shallow } from 'enzyme';
import PatientDetails from './PatientDetails';

describe('<PatientDetails />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientDetails />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
