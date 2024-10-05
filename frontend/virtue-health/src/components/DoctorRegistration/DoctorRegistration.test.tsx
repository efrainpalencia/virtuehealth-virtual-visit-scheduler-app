import React from 'react';
import { shallow } from 'enzyme';
import DoctorRegistration from './DoctorRegistration';

describe('<DoctorRegistration />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorRegistration />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
