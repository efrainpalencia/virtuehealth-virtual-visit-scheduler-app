import React from 'react';
import { shallow } from 'enzyme';
import DoctorProfileList from './DoctorProfileList';

describe('<DoctorProfileList />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorProfileList />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
