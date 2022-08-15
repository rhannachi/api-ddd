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

      const name = httprequest.body?.name as string
      const email = httprequest.body?.email as string
      const password = httprequest.body?.password as string

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
