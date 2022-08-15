import { IAddUser, IUserModel } from '@/domain/user'
import { MissingParamsError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '../http'
import { IFieldsValidation, IHttpRequest } from '@/presentation/protocols'

import { SignUpController } from './signup'

interface IMockSignup {
  signUpController: SignUpController
  addUser: IAddUser
  fieldsValidation: IFieldsValidation
}

const mockHttpRequest: IHttpRequest = {
  body: {
    email: 'email@gmail.com',
    name: 'name',
    password: 'password',
    passwordConfirmation: 'password',
  },
}

const mockResponseAddUser: IUserModel = {
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'valid_password',
}

const mockFieldsValidation = (): IFieldsValidation => {
  class ValidationMock implements IFieldsValidation {
    validate(_input: IHttpRequest['body']): Error | void {
      return
    }
  }
  return new ValidationMock()
}

const mockAddUser = (): IAddUser => {
  class AddUserMock implements IAddUser {
    async add(): Promise<IUserModel> {
      return Promise.resolve(mockResponseAddUser)
    }
  }
  return new AddUserMock()
}

const mockSignup = (): IMockSignup => {
  const addUser = mockAddUser()
  const fieldsValidation = mockFieldsValidation()
  const signUpController = new SignUpController(fieldsValidation, addUser)

  return {
    signUpController,
    fieldsValidation,
    addUser,
  }
}

describe('SignUp Controller', () => {
  test('500 if AddUser throws', async () => {
    const { signUpController, addUser } = mockSignup()

    jest.spyOn(addUser, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpresponse = await signUpController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(serverError(new ServerError()))
  })

  test('call AddUser with correct values', async () => {
    const { signUpController, addUser } = mockSignup()

    const addSpy = jest.spyOn(addUser, 'add')
    await signUpController.handle(mockHttpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      email: 'email@gmail.com',
      name: 'name',
      password: 'password',
    })
  })

  test('200 if valid data is provided', async () => {
    const { signUpController } = mockSignup()
    const httpresponse = await signUpController.handle(mockHttpRequest)
    expect(httpresponse).toEqual(ok(mockResponseAddUser))
  })

  test('call Validation with correct values', async () => {
    const { signUpController, fieldsValidation } = mockSignup()
    const validationSpy = jest.spyOn(fieldsValidation, 'validate')
    await signUpController.handle(mockHttpRequest)

    expect(validationSpy).toHaveBeenCalledWith(mockHttpRequest.body)
  })

  test('400 if fieldsValidation error', async () => {
    const { signUpController, fieldsValidation } = mockSignup()
    jest
      .spyOn(fieldsValidation, 'validate')
      .mockReturnValueOnce(new MissingParamsError('field'))
    const httpresponse = await signUpController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(badRequest(new MissingParamsError('field')))
  })
})
