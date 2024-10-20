import React from "react";
import { shallow } from "enzyme";
import PatientPortalLayout from "./PatientPortalLayout";

describe("<PatientPortalLayout />", () => {
  let component;

  beforeEach(() => {
    component = shallow(<PatientPortalLayout />);
  });

  test("It should mount", () => {
    expect(component.length).toBe(1);
  });
});
