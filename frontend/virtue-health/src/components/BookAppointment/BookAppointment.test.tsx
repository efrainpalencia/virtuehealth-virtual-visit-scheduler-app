import React from 'react';
import { shallow } from 'enzyme';
import BookAppointment from './BookAppointment';

describe('<BookAppointment />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<BookAppointment />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
