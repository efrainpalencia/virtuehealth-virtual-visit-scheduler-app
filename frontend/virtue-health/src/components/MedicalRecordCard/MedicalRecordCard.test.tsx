import React from 'react';
import { shallow } from 'enzyme';
import MedicalRecordCard from './MedicalRecordCard';

describe('<MedicalRecordCard />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<MedicalRecordCard />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
