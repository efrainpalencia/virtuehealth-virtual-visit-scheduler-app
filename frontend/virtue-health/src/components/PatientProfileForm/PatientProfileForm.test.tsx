import React from 'react';
import { shallow } from 'enzyme';
import PatientProfileForm from './PatientProfileForm';

describe('<PatientProfileForm />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientProfileForm />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
