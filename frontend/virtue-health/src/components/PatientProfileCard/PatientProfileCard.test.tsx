import React from 'react';
import { shallow } from 'enzyme';
import PatientProfileCard from './PatientProfileCard';

describe('<PatientProfileCard />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientProfileCard />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
