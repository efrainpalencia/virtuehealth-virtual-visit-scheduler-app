import React from 'react';
import { shallow } from 'enzyme';
import PasswordResetLink from './PasswordResetLink';

describe('<PasswordResetLink />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PasswordResetLink />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
