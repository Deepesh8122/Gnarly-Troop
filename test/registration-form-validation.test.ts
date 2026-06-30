import { describe, it, expect } from "vitest";
import {
  INITIAL_FORM_VALUES,
  validateRegistrationStep,
  firstFieldError,
} from "@/lib/registration/form-validation";

describe("validateRegistrationStep", () => {
  it("requires group and role on accreditation step", () => {
    const errors = validateRegistrationStep(1, INITIAL_FORM_VALUES);
    expect(errors.categoryGroup).toBeTruthy();
    expect(errors.accreditation_category).toBeTruthy();
  });

  it("accepts valid group and matching role", () => {
    const errors = validateRegistrationStep(1, {
      ...INITIAL_FORM_VALUES,
      categoryGroup: "Diplomatic & Government",
      accreditation_category: "ambassador",
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("rejects role that does not match group", () => {
    const errors = validateRegistrationStep(1, {
      ...INITIAL_FORM_VALUES,
      categoryGroup: "Youth & Education",
      accreditation_category: "ambassador",
    });
    expect(errors.accreditation_category).toBeTruthy();
  });

  it("requires personal fields on details step", () => {
    const errors = validateRegistrationStep(2, INITIAL_FORM_VALUES);
    expect(errors.full_name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.phone).toBeTruthy();
  });

  it("requires declarations on review step", () => {
    const errors = validateRegistrationStep(5, INITIAL_FORM_VALUES);
    expect(errors.code_of_conduct).toBeTruthy();
    expect(errors.declaration_accepted).toBeTruthy();
    expect(errors.signature_place).toBeTruthy();
  });

  it("returns first error message", () => {
    const msg = firstFieldError({ full_name: "Full name is required." });
    expect(msg).toBe("Full name is required.");
  });
});
