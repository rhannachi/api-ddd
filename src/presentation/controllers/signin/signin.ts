import { IAuthentication } from '@/domain/authentication'
import { InvalidParamsError, MissingParamsError } from '@/presentation/errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helper'
import {
  IController,
  IEmailValidation,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

export class SignInController implements IController {
  private readonly emailValidation: IEmailValidation
  private readonly authentication: IAuthentication

  constructor(
    emailValidation: IEmailValidation,
    authentication: IAuthentication
  ) {
    this.emailValidation = emailValidation
    this.authentication = authentication
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (httpRequest.body[field] === undefined) {
          return badRequest(new MissingParamsError(field))
        }
      }

      const { email, password } = httpRequest.body

      const isValidEmail = this.emailValidation.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamsError('email'))
      }

      const token = await this.authentication.authentication(email, password)

      if (!token) {
        return unauthorized()
      }

      return ok({ token })
    } catch (error: unknown) {
      return serverError(error)
    }
  }
}
