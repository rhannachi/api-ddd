import { InvalidParamsError, MissingParamsError } from "../../errors";
import { badRequest, serverError, ok } from "../../helpers/http";
import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "./signup.protocols";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(httprequest: HttpRequest): Promise<HttpResponse> {
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

      const { name, email, password, passwordConfirmation } = httprequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamsError("passwordConfirmation"));
      }

      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamsError("email"));
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return ok(account);
    } catch (error) {
      return serverError();
    }
  }
}
