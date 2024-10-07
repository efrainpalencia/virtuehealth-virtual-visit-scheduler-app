import React from 'react';
import { shallow } from 'enzyme';
import PatientProfileList from './PatientProfileList';

describe('<PatientProfileList />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientProfileList />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
