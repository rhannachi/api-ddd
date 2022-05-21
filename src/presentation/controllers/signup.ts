export class SignUpController {
  handle(httprequest: any): any {
    if (!httprequest?.body?.name) {
      return {
        body: new Error("Missing param name"),
        statusCode: 400,
      };
    }

    if (!httprequest?.body?.email) {
      return {
        body: new Error("Missing param email"),
        statusCode: 400,
      };
    }
  }
}
