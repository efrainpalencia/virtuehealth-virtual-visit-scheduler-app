import React from 'react';
import { shallow } from 'enzyme';
import PasswordResetRequestForm from './PasswordResetRequestForm';

describe('<PasswordResetRequestForm />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PasswordResetRequestForm />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
