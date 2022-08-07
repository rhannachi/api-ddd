import { IAddUser } from '@/domain/user'
import { InvalidParamsError, MissingParamsError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helper'
import {
  IController,
  IEmailValidation,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'

export class SignUpController implements IController {
  private readonly emailValidation: IEmailValidation
  private readonly addUser: IAddUser

  constructor(emailValidation: IEmailValidation, addUser: IAddUser) {
    this.emailValidation = emailValidation
    this.addUser = addUser
  }

  async handle(httprequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
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

      const user = await this.addUser.add({
        name,
        email,
        password,
      })

      return ok(user)
    } catch (error: unknown) {
      return serverError(error)
    }
  }
}
