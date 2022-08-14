import { IAddUser } from '@/domain/user'
import {
  IController,
  IHttpRequest,
  IValidation,
  IHttpResponse,
} from '@/presentation/protocols'
import { badRequest, ok, serverError } from '../http'

export class SignUpController implements IController {
  private readonly validation: IValidation
  private readonly addUser: IAddUser

  constructor(validation: IValidation, addUser: IAddUser) {
    this.validation = validation
    this.addUser = addUser
  }

  async handle(httprequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httprequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httprequest.body

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
