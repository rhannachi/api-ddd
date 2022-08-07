import { InvalidParamsError, MissingParamsError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helper'
import {
  IController,
  IEmailValidation,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

export class SignInController implements IController {
  private readonly emailValidation: IEmailValidation

  constructor(emailValidation: IEmailValidation) {
    this.emailValidation = emailValidation
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (httpRequest.body[field] === undefined) {
        return badRequest(new MissingParamsError(field))
      }
    }

    const { email, _password } = httpRequest.body

    const isValidEmail = this.emailValidation.isValid(email)
    if (!isValidEmail) {
      return badRequest(new InvalidParamsError('email'))
    }

    // TODO remove this !!!
    return Promise.resolve({ body: {}, status: 200 })
  }
}
