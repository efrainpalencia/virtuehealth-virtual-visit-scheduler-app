import React from 'react';
import { shallow } from 'enzyme';
import DoctorRoomPage from './DoctorRoomPage';

describe('<DoctorRoomPage />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<DoctorRoomPage />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
