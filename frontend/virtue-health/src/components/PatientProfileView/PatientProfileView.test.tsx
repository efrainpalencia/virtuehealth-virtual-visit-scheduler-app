import React from 'react';
import { shallow } from 'enzyme';
import PatientProfileView from './PatientProfileView';

describe('<PatientProfileView />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientProfileView />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
