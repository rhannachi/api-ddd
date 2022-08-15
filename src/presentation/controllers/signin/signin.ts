import { IAuthentication } from '@/domain/authentication'
import { InvalidParamsError, MissingParamsError } from '@/presentation/errors'
import {
  IController,
  IEmailValidationAdapter,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'
import { badRequest, ok, serverError, unauthorized } from '../http'

export class SignInController implements IController {
  private readonly emailValidationAdapter: IEmailValidationAdapter
  private readonly authentication: IAuthentication

  constructor(
    emailValidationAdapter: IEmailValidationAdapter,
    authentication: IAuthentication
  ) {
    this.emailValidationAdapter = emailValidationAdapter
    this.authentication = authentication
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (httpRequest.body?.[field] === undefined) {
          return badRequest(new MissingParamsError(field))
        }
      }

      const email = httpRequest.body?.email as string
      const password = httpRequest.body?.password as string

      const isValidEmail = this.emailValidationAdapter.isValid(email)
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
