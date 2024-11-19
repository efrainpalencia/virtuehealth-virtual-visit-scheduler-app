import React from 'react';
import { shallow } from 'enzyme';
import VideoCallPage from './VideoCallPage';

describe('<VideoCallPage />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<VideoCallPage />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
