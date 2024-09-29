import React from 'react';
import { shallow } from 'enzyme';
import PasswordReset from './PasswordReset';

describe('<PasswordReset />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PasswordReset />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
