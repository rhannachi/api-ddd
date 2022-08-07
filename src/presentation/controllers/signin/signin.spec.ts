import { InvalidParamsError, MissingParamsError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helper'
import { IEmailValidation, IHttpRequest } from '@/presentation/protocols'
import { SignInController } from './signin'

interface IMockSignIn {
  signInController: SignInController
  emailValidation: IEmailValidation
}

const mockHttpRequest: IHttpRequest = {
  body: {
    email: 'email@gmail.com',
    password: 'password',
  },
}

const mockEmailValidation = (): IEmailValidation => {
  class EmailValidationMock implements IEmailValidation {
    isValid(): boolean {
      return true
    }
  }
  return new EmailValidationMock()
}

const mockSignin = (): IMockSignIn => {
  const emailValidation = mockEmailValidation()
  const signInController = new SignInController(emailValidation)
  return {
    signInController,
    emailValidation,
  }
}

describe('Sign In Controller', () => {
  test('400 if no email is provided', async () => {
    const { signInController } = mockSignin()
    const httpRequest = {
      body: {
        password: 'password',
      },
    }
    const httpResponse = await signInController.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamsError('email')))
  })

  test('400 if no password is provided', async () => {
    const { signInController } = mockSignin()
    const httpRequest = {
      body: {
        email: 'email',
      },
    }
    const httpResponse = await signInController.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamsError('password')))
  })

  test('400 if an invalid email', async () => {
    const { signInController, emailValidation } = mockSignin()

    jest.spyOn(emailValidation, 'isValid').mockReturnValueOnce(false)
    const httpresponse = await signInController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(badRequest(new InvalidParamsError('email')))
  })

  test('call EmailValidation with correct email', async () => {
    const { signInController, emailValidation } = mockSignin()

    const isValidSpy = jest.spyOn(emailValidation, 'isValid')
    await signInController.handle(mockHttpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('email@gmail.com')
  })
})
