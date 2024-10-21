import React from 'react';
import { shallow } from 'enzyme';
import DoctorProfileForm from './DoctorProfileForm';

describe('<DoctorProfileForm />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorProfileForm />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
