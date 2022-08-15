import { IAuthentication } from '@/domain/authentication/authentication'
import { ServerError } from '@/presentation/errors'
import { ok, serverError, unauthorized } from '../http'
import { IFieldsValidation, IHttpRequest } from '@/presentation/protocols'
import { SignInController } from './signin'

interface IMockSignIn {
  signInController: SignInController
  authentication: IAuthentication
  fieldsValidation: IFieldsValidation
}

const mockHttpRequest: IHttpRequest = {
  body: {
    email: 'email@gmail.com',
    password: 'password',
  },
}

const mockFieldsValidation = (): IFieldsValidation => {
  class ValidationMock implements IFieldsValidation {
    validate(_input: IHttpRequest['body']): Error | void {
      return
    }
  }
  return new ValidationMock()
}

const mockAuthentication = (): IAuthentication => {
  class AuthenticationMock implements IAuthentication {
    authentication(_email: string, _password: string): Promise<string | null> {
      return Promise.resolve('token')
    }
  }
  return new AuthenticationMock()
}

const mockSignin = (): IMockSignIn => {
  const authentication = mockAuthentication()
  const fieldsValidation = mockFieldsValidation()
  const signInController = new SignInController(
    authentication,
    fieldsValidation
  )

  return {
    signInController,
    authentication,
    fieldsValidation,
  }
}

describe('Sign In Controller', () => {
  test('call AddUser with correct values', async () => {
    const { signInController, authentication } = mockSignin()

    const authSpy = jest.spyOn(authentication, 'authentication')
    await signInController.handle(mockHttpRequest)

    expect(authSpy).toHaveBeenCalledWith('email@gmail.com', 'password')
  })

  test('401 if invalid credentials', async () => {
    const { signInController, authentication } = mockSignin()

    jest
      .spyOn(authentication, 'authentication')
      .mockResolvedValueOnce(Promise.resolve(null))
    const httpresponse = await signInController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(unauthorized())
  })

  test('500 if Authentication throws', async () => {
    const { signInController, authentication } = mockSignin()

    jest.spyOn(authentication, 'authentication').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpresponse = await signInController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(serverError(new ServerError()))
  })

  test('200 if valid credentials', async () => {
    const { signInController } = mockSignin()
    const httpresponse = await signInController.handle(mockHttpRequest)
    expect(httpresponse).toEqual(ok({ token: 'token' }))
  })
})
