import { HttpRequest, HttpResponse } from "./http";

export interface Controller {
  handle(httprequest: HttpRequest): HttpResponse;
}
