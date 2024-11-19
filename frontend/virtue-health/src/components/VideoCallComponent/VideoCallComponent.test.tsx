import React from 'react';
import { shallow } from 'enzyme';
import VideoCallComponent from './VideoCallComponent';

describe('<VideoCallComponent />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<VideoCallComponent />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
