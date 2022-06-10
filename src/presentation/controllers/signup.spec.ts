import { IAccountModel, IAddAccount, IAddAccountModel } from '../../domain'
import { InvalidParamsError, MissingParamsError, ServerError } from '../errors'
import { ok, badRequest, serverError } from '../helper'
import { IEmailValidator, IHttpRequest } from '../protocols'
import { SignUpController } from './signup'

interface IMockSignup {
  signUpController: SignUpController
  emailValidator: IEmailValidator
  addAccount: IAddAccount
}

const mockEmailValidator = (): IEmailValidator => {
  class EmailValidatorMock implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorMock()
}

const mockHttpRequest: IHttpRequest = {
  body: {
    email: 'email@gmail.com',
    name: 'name',
    password: 'password',
    passwordConfirmation: 'password'
  }
}

const mockResponseAddAccount: IAccountModel = {
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'valid_password'
}

const mockAddAccount = (): IAddAccount => {
  class AddAccountMock implements IAddAccount {
    async add (account: IAddAccountModel): Promise<IAccountModel> {
      return await Promise.resolve(mockResponseAddAccount)
    }
  }
  return new AddAccountMock()
}

const mockSignup = (): IMockSignup => {
  const emailValidator = mockEmailValidator()
  const addAccount = mockAddAccount()
  const signUpController = new SignUpController(emailValidator, addAccount)

  return {
    signUpController,
    emailValidator,
    addAccount
  }
}

describe('SignUp Controller', () => {
  test('400 if no name is provided', async () => {
    const { signUpController } = mockSignup()
    const httprequest = {
      body: {
        email: 'email@gmail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
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
        passwordConfirmation: 'password'
      }
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
        passwordConfirmation: 'password'
      }
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
        password: 'password'
      }
    }
    const httpresponse = await signUpController.handle(httprequest)

    expect(httpresponse).toEqual(badRequest(new MissingParamsError('passwordConfirmation')))
  })

  test('400 if password confirmation fails', async () => {
    const { signUpController } = mockSignup()
    const httprequest = {
      body: {
        email: 'email@gmail.com',
        name: 'name',
        password: 'password',
        passwordConfirmation: '_password'
      }
    }
    const httpresponse = await signUpController.handle(httprequest)

    expect(httpresponse).toEqual(badRequest(new InvalidParamsError('passwordConfirmation')))
  })

  test('400 if an invalid email', async () => {
    const { signUpController, emailValidator } = mockSignup()

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const httpresponse = await signUpController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(badRequest(new InvalidParamsError('email')))
  })

  test('call EmailValidator with correct email', async () => {
    const { signUpController, emailValidator } = mockSignup()

    const isValidSpy = jest.spyOn(emailValidator, 'isValid')
    await signUpController.handle(mockHttpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('email@gmail.com')
  })

  test('500 if EmailValidator throws', async () => {
    const { signUpController, emailValidator } = mockSignup()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpresponse = await signUpController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(serverError(new ServerError()))
  })

  test('500 if AddAccount throws', async () => {
    const { signUpController, addAccount } = mockSignup()

    jest.spyOn(addAccount, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpresponse = await signUpController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(serverError(new ServerError()))
  })

  test('call AddAccount with correct values', async () => {
    const { signUpController, addAccount } = mockSignup()

    const addSpy = jest.spyOn(addAccount, 'add')
    await signUpController.handle(mockHttpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      email: 'email@gmail.com',
      name: 'name',
      password: 'password'
    })
  })

  test('200 if valid data is provided', async () => {
    const { signUpController } = mockSignup()

    const httprequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpresponse = await signUpController.handle(httprequest)
    expect(httpresponse).toEqual(ok(mockResponseAddAccount))
  })
})
