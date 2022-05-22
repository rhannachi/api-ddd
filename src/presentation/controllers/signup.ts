import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamsError } from "../errors/missingParamsError";
import { badRequest } from "../helpers/httpHelper";

export class SignUpController {
  handle(httprequest: HttpRequest): HttpResponse | undefined {
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
  }
}
