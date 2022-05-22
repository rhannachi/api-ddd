import { InvalidParamsError } from "../errors/invalidParamsError";
import { MissingParamsError } from "../errors/missingParamsError";
import { EmailValidator } from "../protocols/emailValidator";
import { SignUpController } from "./signup";

interface MakeSutTypes {
  emailValidatorMock: EmailValidator;
  sut: SignUpController;
}

const makeSut = (): MakeSutTypes => {
  class EmailValidatorMock implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorMock = new EmailValidatorMock();
  const sut = new SignUpController(emailValidatorMock);

  return {
    emailValidatorMock,
    sut,
  };
};

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", () => {
    const { sut } = makeSut();
    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = sut.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(400);
    expect(httpresponse?.body).toEqual(new MissingParamsError("name"));
  });

  test("should return 400 if no email is provided", () => {
    const { sut } = makeSut();
    const httprequest = {
      body: {
        name: "my_name",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = sut.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(400);
    expect(httpresponse?.body).toEqual(new MissingParamsError("email"));
  });

  test("should return 400 if no password is provided", () => {
    const { sut } = makeSut();
    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        name: "my_name",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = sut.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(400);
    expect(httpresponse?.body).toEqual(new MissingParamsError("password"));
  });

  test("should return 400 if no password confirmation is provided", () => {
    const { sut } = makeSut();
    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        name: "my_name",
        password: "my_password",
      },
    };
    const httpresponse = sut.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(400);
    expect(httpresponse?.body).toEqual(
      new MissingParamsError("passwordConfirmation")
    );
  });

  test("should return 400 if an invalid email is provided", () => {
    const { sut, emailValidatorMock } = makeSut();

    jest.spyOn(emailValidatorMock, "isValid").mockReturnValueOnce(false);

    const httprequest = {
      body: {
        email: "invalid_email@gmail.com",
        name: "my_name",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = sut.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(400);
    expect(httpresponse?.body).toEqual(new InvalidParamsError("email"));
  });
});