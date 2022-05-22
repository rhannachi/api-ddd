import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamsError } from "../errors/missingParamsError";
import { badRequest } from "../helpers/httpHelper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/emailValidator";
import { InvalidParamsError } from "../errors/invalidParamsError";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httprequest: HttpRequest): HttpResponse {
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

    const isValidEmail = this.emailValidator.isValid(httprequest.body.email);
    if (!isValidEmail) {
      return badRequest(new InvalidParamsError("email"));
    }

    // TODO remove in future devs
    return {
      statusCode: 500,
      body: "TODO",
    };
  }
}
