import { badRequest, serverError } from "../helpers/httpHelper";
import { InvalidParamsError, MissingParamsError } from "../errors";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httprequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];

      for (const field of requiredFields) {
        if (!httprequest.body[field]) {
          return badRequest(new MissingParamsError(field));
        }
      }

      const { email, password, passwordConfirmation } = httprequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamsError("passwordConfirmation"));
      }

      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamsError("email"));
      }
    } catch (error) {
      return serverError();
    }

    // TODO remove in future devs
    return {
      statusCode: 500,
      body: "TODO",
    };
  }
}
