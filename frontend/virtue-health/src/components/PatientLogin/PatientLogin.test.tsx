import React from 'react';
import { shallow } from 'enzyme';
import PatientLogin from './PatientLogin';

describe('<PatientLogin />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientLogin />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
