import { IAddAccount } from '../../domain'
import { InvalidParamsError, MissingParamsError } from '../errors'
import { badRequest, ok, serverError } from '../helper'
import { IController, IHttpRequest, IHttpResponse, IEmailValidation } from '../protocols'

export class SignUpController implements IController {
  private readonly emailValidation: IEmailValidation
  private readonly addAccount: IAddAccount

  constructor (emailValidation: IEmailValidation, addAccount: IAddAccount) {
    this.emailValidation = emailValidation
    this.addAccount = addAccount
  }

  async handle (httprequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      for (const field of requiredFields) {
        if (httprequest.body[field] === undefined) {
          return badRequest(new MissingParamsError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httprequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamsError('passwordConfirmation'))
      }

      const isValidEmail = this.emailValidation.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamsError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error: unknown) {
      return serverError(error)
    }
  }
}
