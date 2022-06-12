import { IAddUser, IUserModel } from '@/domain/user'
import { InvalidParamsError, MissingParamsError, ServerError } from '../errors'
import { ok, badRequest, serverError } from '../helper'
import { IEmailValidation, IHttpRequest } from '../protocols'
import { SignUpController } from './signup'

interface IMockSignup {
  signUpController: SignUpController
  emailValidation: IEmailValidation
  addUser: IAddUser
}

const mockEmailValidation = (): IEmailValidation => {
  class EmailValidationMock implements IEmailValidation {
    isValid(): boolean {
      return true
    }
  }
  return new EmailValidationMock()
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

const mockAddUser = (): IAddUser => {
  class AddUserMock implements IAddUser {
    async add(): Promise<IUserModel> {
      return await Promise.resolve(mockResponseAddUser)
    }
  }
  return new AddUserMock()
}

const mockSignup = (): IMockSignup => {
  const emailValidation = mockEmailValidation()
  const addUser = mockAddUser()
  const signUpController = new SignUpController(emailValidation, addUser)

  return {
    signUpController,
    emailValidation,
    addUser,
  }
}

describe('SignUp Controller', () => {
  test('400 if no name is provided', async () => {
    const { signUpController } = mockSignup()
    const httprequest = {
      body: {
        email: 'email@gmail.com',
        password: 'password',
        passwordConfirmation: 'password',
      },
    }
    const httpresponse = await signUpController.handle(httprequest)

    expect(httpresponse?.status).toBe(400)
    expect(httpresponse?.body).toEqual(new MissingParamsError('name'))
  })

  test('400 if no email is provided', async () => {
    const { signUpController } = mockSignup()
    const httprequest = {
      body: {
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password',
      },
    }
    const httpresponse = await signUpController.handle(httprequest)

    expect(httpresponse).toEqual(badRequest(new MissingParamsError('email')))
  })

  test('400 if no password is provided', async () => {
    const { signUpController } = mockSignup()
    const httprequest = {
      body: {
        email: 'email@gmail.com',
        name: 'name',
        passwordConfirmation: 'password',
      },
    }
    const httpresponse = await signUpController.handle(httprequest)

    expect(httpresponse).toEqual(badRequest(new MissingParamsError('password')))
  })

  test('400 if no password confirmation is provided', async () => {
    const { signUpController } = mockSignup()
    const httprequest = {
      body: {
        email: 'email@gmail.com',
        name: 'name',
        password: 'password',
      },
    }
    const httpresponse = await signUpController.handle(httprequest)

    expect(httpresponse).toEqual(
      badRequest(new MissingParamsError('passwordConfirmation'))
    )
  })

  test('400 if password confirmation fails', async () => {
    const { signUpController } = mockSignup()
    const httprequest = {
      body: {
        email: 'email@gmail.com',
        name: 'name',
        password: 'password',
        passwordConfirmation: '_password',
      },
    }
    const httpresponse = await signUpController.handle(httprequest)

    expect(httpresponse).toEqual(
      badRequest(new InvalidParamsError('passwordConfirmation'))
    )
  })

  test('400 if an invalid email', async () => {
    const { signUpController, emailValidation } = mockSignup()

    jest.spyOn(emailValidation, 'isValid').mockReturnValueOnce(false)
    const httpresponse = await signUpController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(badRequest(new InvalidParamsError('email')))
  })

  test('call EmailValidation with correct email', async () => {
    const { signUpController, emailValidation } = mockSignup()

    const isValidSpy = jest.spyOn(emailValidation, 'isValid')
    await signUpController.handle(mockHttpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('email@gmail.com')
  })

  test('500 if EmailValidation throws', async () => {
    const { signUpController, emailValidation } = mockSignup()

    jest.spyOn(emailValidation, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpresponse = await signUpController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(serverError(new ServerError()))
  })

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

    const httprequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    }
    const httpresponse = await signUpController.handle(httprequest)
    expect(httpresponse).toEqual(ok(mockResponseAddUser))
  })
})
