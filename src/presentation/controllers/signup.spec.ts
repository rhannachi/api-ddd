import { IAccountModel } from '../../domain/models'
import { IAddAccount, IAddAccountModel } from '../../domain/usecases'
import { InvalidParamsError, MissingParamsError, ServerError } from '../errors'
import { ok, badRequest, serverError } from '../helper'
import { IEmailValidator, IHttpRequest } from '../protocols'
import { SignUpController } from './signup'

interface IMockSignup {
  signup: SignUpController
  emailValidatorMock: IEmailValidator
  addAccountMock: IAddAccount
}

const mockEmailValidator = (): IEmailValidator => {
  class EmailValidatorMock implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorMock()
}

const mockHttpRequest = (): IHttpRequest => ({
  body: {
    email: 'email@gmail.com',
    name: 'name',
    password: 'password',
    passwordConfirmation: 'password'
  }
})

const mockResponseAddAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'valid_password'
})

const mockAddAccount = (): IAddAccount => {
  class AddAccountMock implements IAddAccount {
    async add (account: IAddAccountModel): Promise<IAccountModel> {
      return await Promise.resolve(mockResponseAddAccount())
    }
  }
  return new AddAccountMock()
}

const mockSignup = (): IMockSignup => {
  const emailValidatorMock = mockEmailValidator()
  const addAccountMock = mockAddAccount()
  const signup = new SignUpController(emailValidatorMock, addAccountMock)

  return {
    signup,
    emailValidatorMock,
    addAccountMock
  }
}

describe('SignUp Controller', () => {
  test('400 if no name is provided', async () => {
    const { signup } = mockSignup()
    const httprequest = {
      body: {
        email: 'email@gmail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpresponse = await signup.handle(httprequest)

    expect(httpresponse?.status).toBe(400)
    expect(httpresponse?.body).toEqual(new MissingParamsError('name'))
  })

  test('400 if no email is provided', async () => {
    const { signup } = mockSignup()
    const httprequest = {
      body: {
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpresponse = await signup.handle(httprequest)

    expect(httpresponse).toEqual(badRequest(new MissingParamsError('email')))
  })

  test('400 if no password is provided', async () => {
    const { signup } = mockSignup()
    const httprequest = {
      body: {
        email: 'email@gmail.com',
        name: 'name',
        passwordConfirmation: 'password'
      }
    }
    const httpresponse = await signup.handle(httprequest)

    expect(httpresponse).toEqual(badRequest(new MissingParamsError('password')))
  })

  test('400 if no password confirmation is provided', async () => {
    const { signup } = mockSignup()
    const httprequest = {
      body: {
        email: 'email@gmail.com',
        name: 'name',
        password: 'password'
      }
    }
    const httpresponse = await signup.handle(httprequest)

    expect(httpresponse).toEqual(badRequest(new MissingParamsError('passwordConfirmation')))
  })

  test('400 if password confirmation fails', async () => {
    const { signup } = mockSignup()
    const httprequest = {
      body: {
        email: 'email@gmail.com',
        name: 'name',
        password: 'password',
        passwordConfirmation: '_password'
      }
    }
    const httpresponse = await signup.handle(httprequest)

    expect(httpresponse).toEqual(badRequest(new InvalidParamsError('passwordConfirmation')))
  })

  test('400 if an invalid email', async () => {
    const { signup, emailValidatorMock } = mockSignup()

    jest.spyOn(emailValidatorMock, 'isValid').mockReturnValueOnce(false)
    const httpresponse = await signup.handle(mockHttpRequest())

    expect(httpresponse).toEqual(badRequest(new InvalidParamsError('email')))
  })

  test('call EmailValidator with correct email', async () => {
    const { signup, emailValidatorMock } = mockSignup()

    const isValidSpy = jest.spyOn(emailValidatorMock, 'isValid')
    await signup.handle(mockHttpRequest())

    expect(isValidSpy).toHaveBeenCalledWith('email@gmail.com')
  })

  test('500 if EmailValidator throws', async () => {
    const { signup, emailValidatorMock } = mockSignup()

    jest.spyOn(emailValidatorMock, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpresponse = await signup.handle(mockHttpRequest())

    expect(httpresponse).toEqual(serverError(new ServerError()))
  })

  test('500 if AddAccount throws', async () => {
    const { signup, addAccountMock } = mockSignup()

    jest.spyOn(addAccountMock, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpresponse = await signup.handle(mockHttpRequest())

    expect(httpresponse).toEqual(serverError(new ServerError()))
  })

  test('call AddAccount with correct values', async () => {
    const { signup, addAccountMock } = mockSignup()

    const addSpy = jest.spyOn(addAccountMock, 'add')
    await signup.handle(mockHttpRequest())

    expect(addSpy).toHaveBeenCalledWith({
      email: 'email@gmail.com',
      name: 'name',
      password: 'password'
    })
  })

  test('200 if valid data is provided', async () => {
    const { signup } = mockSignup()

    const httprequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpresponse = await signup.handle(httprequest)
    expect(httpresponse).toEqual(ok(mockResponseAddAccount()))
  })
})
