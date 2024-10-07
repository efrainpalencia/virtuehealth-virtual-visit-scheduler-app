import React from 'react';
import { shallow } from 'enzyme';
import PatientList from './PatientList';

describe('<PatientList />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientList />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
