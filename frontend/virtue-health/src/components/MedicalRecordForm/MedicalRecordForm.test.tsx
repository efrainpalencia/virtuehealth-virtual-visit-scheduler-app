import React from 'react';
import { shallow } from 'enzyme';
import MedicalRecordForm from './MedicalRecordForm';

describe('<MedicalRecordForm />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<MedicalRecordForm />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
