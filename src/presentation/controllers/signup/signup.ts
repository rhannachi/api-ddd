import { IAddUser } from '@/domain/user'
import {
  IController,
  IHttpRequest,
  IFieldsValidation,
  IHttpResponse,
} from '@/presentation/protocols'
import { badRequest, ok, serverError } from '../http'

export class SignUpController implements IController {
  private readonly fieldsValidation: IFieldsValidation
  private readonly addUser: IAddUser

  constructor(fieldsValidation: IFieldsValidation, addUser: IAddUser) {
    this.fieldsValidation = fieldsValidation
    this.addUser = addUser
  }

  async handle(httprequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.fieldsValidation.validate(httprequest.body)
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
