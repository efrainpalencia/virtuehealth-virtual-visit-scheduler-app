import React from 'react';
import { shallow } from 'enzyme';
import DoctorProfileCard from './DoctorProfileCard';

describe('<DoctorProfileCard />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorProfileCard />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
