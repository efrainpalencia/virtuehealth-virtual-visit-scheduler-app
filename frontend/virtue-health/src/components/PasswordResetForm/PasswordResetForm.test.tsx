import React from 'react';
import { shallow } from 'enzyme';
import PasswordResetForm from './PasswordResetForm';

describe('<PasswordResetForm />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PasswordResetForm />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
