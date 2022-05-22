import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamsError } from "../errors/missingParamsError";
import { badRequest } from "../helpers/httpHelper";
import { Controller } from "../protocols/controller";

export class SignUpController implements Controller {
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

    // TODO remove in future devs
    return {
      statusCode: 500,
      body: "TODO",
    };
  }
}
