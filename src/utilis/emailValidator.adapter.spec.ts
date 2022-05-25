import { EmailValidatorAdapter } from "./emailValidator";

describe("EmailValidator", () => {
  test("Should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("invalid_email@gmail.com");
    expect(isValid).toBe(false);
  });
});
