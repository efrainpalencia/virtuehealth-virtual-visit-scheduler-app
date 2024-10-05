import React from 'react';
import { shallow } from 'enzyme';
import PatientRegistration from './PatientRegistration';

describe('<PatientRegistration />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientRegistration />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
