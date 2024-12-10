import React from 'react';
import { shallow } from 'enzyme';
import AppMenu from './AppMenu';

describe('<AppMenu />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<AppMenu />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
