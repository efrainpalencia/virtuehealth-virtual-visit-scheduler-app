import React from 'react';
import { shallow } from 'enzyme';
import PatientRoomPage from './PatientRoomPage';

describe('<PatientRoomPage />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientRoomPage />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
