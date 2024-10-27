import React from 'react';
import { shallow } from 'enzyme';
import AppointmentForm from './AppointmentForm';

describe('<AppointmentForm />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<AppointmentForm />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
