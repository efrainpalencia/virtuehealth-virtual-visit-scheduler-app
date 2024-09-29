import React from 'react';
import { shallow } from 'enzyme';
import PatientPortal from './PatientPortal';

describe('<PatientPortal />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientPortal />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
