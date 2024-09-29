import React from 'react';
import { shallow } from 'enzyme';
import DoctorLogin from './DoctorLogin';

describe('<DoctorLogin />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorLogin />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
