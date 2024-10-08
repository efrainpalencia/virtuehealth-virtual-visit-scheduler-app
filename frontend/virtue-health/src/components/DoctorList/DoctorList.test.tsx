import React from 'react';
import { shallow } from 'enzyme';
import DoctorList from './DoctorList';

describe('<DoctorList />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorList />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
