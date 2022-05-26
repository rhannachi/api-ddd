import {
  InvalidParamsError,
  MissingParamsError,
  ServerError,
} from "../../errors";
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  EmailValidator,
} from "./protocols";
import { SignUpController } from "./signup";

interface MakeSignupTypes {
  signup: SignUpController;
  emailValidatorMock: EmailValidator;
  addAccountMock: AddAccount;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorMock implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorMock();
};

const makeAddAccount = (): AddAccount => {
  class addAccountMock implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@gmail.com",
        password: "valid_password",
      };

      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new addAccountMock();
};

const makeSignup = (): MakeSignupTypes => {
  const emailValidatorMock = makeEmailValidator();
  const addAccountMock = makeAddAccount();
  const signup = new SignUpController(emailValidatorMock, addAccountMock);

  return {
    signup,
    emailValidatorMock,
    addAccountMock,
  };
};

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", async () => {
    const { signup } = makeSignup();
    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = await signup.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(400);
    expect(httpresponse?.body).toEqual(new MissingParamsError("name"));
  });

  test("should return 400 if no email is provided", async () => {
    const { signup } = makeSignup();
    const httprequest = {
      body: {
        name: "my_name",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = await signup.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(400);
    expect(httpresponse?.body).toEqual(new MissingParamsError("email"));
  });

  test("should return 400 if no password is provided", async () => {
    const { signup } = makeSignup();
    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        name: "my_name",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = await signup.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(400);
    expect(httpresponse?.body).toEqual(new MissingParamsError("password"));
  });

  test("should return 400 if no password confirmation is provided", async () => {
    const { signup } = makeSignup();
    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        name: "my_name",
        password: "my_password",
      },
    };
    const httpresponse = await signup.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(400);
    expect(httpresponse?.body).toEqual(
      new MissingParamsError("passwordConfirmation")
    );
  });

  test("should return 400 if password confirmation fails", async () => {
    const { signup } = makeSignup();
    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        name: "my_name",
        password: "my_password",
        passwordConfirmation: "invalid_password",
      },
    };
    const httpresponse = await signup.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(400);
    expect(httpresponse?.body).toEqual(
      new InvalidParamsError("passwordConfirmation")
    );
  });

  test("should return 400 if an invalid email is provided", async () => {
    const { signup, emailValidatorMock } = makeSignup();

    jest.spyOn(emailValidatorMock, "isValid").mockReturnValueOnce(false);

    const httprequest = {
      body: {
        email: "invalid_email@gmail.com",
        name: "my_name",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = await signup.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(400);
    expect(httpresponse?.body).toEqual(new InvalidParamsError("email"));
  });

  test("should call EmailValidator with correct email", async () => {
    const { signup, emailValidatorMock } = makeSignup();

    const isValidSpy = jest.spyOn(emailValidatorMock, "isValid");

    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        name: "my_name",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };
    await signup.handle(httprequest);
    expect(isValidSpy).toHaveBeenCalledWith("my_email@gmail.com");
  });

  test("should return 500 if EmailValidator throws", async () => {
    const { signup, emailValidatorMock } = makeSignup();

    jest.spyOn(emailValidatorMock, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        name: "my_name",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = await signup.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(500);
    expect(httpresponse?.body).toEqual(new ServerError());
  });

  test("should return 500 if AddAccount throws", async () => {
    const { signup, addAccountMock } = makeSignup();

    jest.spyOn(addAccountMock, "add").mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        name: "my_name",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };
    const httpresponse = await signup.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(500);
    expect(httpresponse?.body).toEqual(new ServerError());
  });

  test("should call AddAccount with correct values", async () => {
    const { signup, addAccountMock } = makeSignup();

    const addSpy = jest.spyOn(addAccountMock, "add");

    const httprequest = {
      body: {
        email: "my_email@gmail.com",
        name: "my_name",
        password: "my_password",
        passwordConfirmation: "my_password",
      },
    };

    await signup.handle(httprequest);

    expect(addSpy).toHaveBeenCalledWith({
      email: "my_email@gmail.com",
      name: "my_name",
      password: "my_password",
    });
  });

  test("should return 200 if valid data is provided", async () => {
    const { signup } = makeSignup();

    const httprequest = {
      body: {
        name: "valid_name",
        email: "valid_email@gmail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password",
      },
    };
    const httpresponse = await signup.handle(httprequest);
    expect(httpresponse?.statusCode).toBe(200);
    expect(httpresponse?.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@gmail.com",
      password: "valid_password",
    });
  });
});
