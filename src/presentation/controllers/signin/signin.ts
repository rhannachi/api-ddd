import { IAuthentication } from '@/domain/authentication'
import {
  IController,
  IFieldsValidation,
  IHttpRequest,
  IHttpResponse,
} from '@/presentation/protocols'
import { badRequest, ok, serverError, unauthorized } from '../http'

export class SignInController implements IController {
  private readonly fieldsValidation: IFieldsValidation
  private readonly authentication: IAuthentication

  constructor(
    authentication: IAuthentication,
    fieldsValidation: IFieldsValidation
  ) {
    this.fieldsValidation = fieldsValidation
    this.authentication = authentication
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      // const requiredFields = ['email', 'password']

      // for (const field of requiredFields) {
      //   if (httpRequest.body?.[field] === undefined) {
      //     return badRequest(new MissingParamsError(field))
      //   }
      // }

      const error = this.fieldsValidation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const email = httpRequest.body?.email as string
      const password = httpRequest.body?.password as string

      // const isValidEmail = this.fieldsValidation.isValid(email)
      // if (!isValidEmail) {
      //   return badRequest(new InvalidParamsError('email'))
      // }

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
