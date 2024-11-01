import React from 'react';
import { shallow } from 'enzyme';
import Logolink from './Logolink';

describe('<Logolink />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Logolink />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
