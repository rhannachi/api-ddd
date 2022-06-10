import { ILogErrorRepository } from '../../application/protocols'
import { ok, serverError } from '../../presentation/helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface IMockSignup {
  signUpController: SignUpControllerMock
  logControllerDecorator: LogControllerDecorator
  logErrorRepository: LogErrorRepositoryMock
}
class SignUpControllerMock implements IController {
  async handle (httprequest: IHttpRequest): Promise<IHttpResponse> {
    return await Promise.resolve(ok(mockHttpRequest))
  }
}

class LogErrorRepositoryMock implements ILogErrorRepository {
  async log (stack: string): Promise<void> {
    return await Promise.resolve()
  }
}

const mockError = (): IHttpResponse => {
  const error = new Error()
  error.stack = 'fake_error'
  return serverError(error)
}

const mockSignup = (): IMockSignup => {
  const signUpController = new SignUpControllerMock()
  const logErrorRepository = new LogErrorRepositoryMock()
  const logControllerDecorator = new LogControllerDecorator(
    signUpController, logErrorRepository
  )

  return {
    signUpController,
    logControllerDecorator,
    logErrorRepository
  }
}

const mockHttpRequest: IHttpRequest = {
  body: {
    email: 'email@gmail.com',
    name: 'name',
    password: 'password',
    passwordConfirmation: 'password'
  }
}

describe('Log Decorator Controller', () => {
  test('Call function handle from the Controller', async () => {
    const { signUpController, logControllerDecorator } = mockSignup()

    const handleSpy = jest.spyOn(signUpController, 'handle')
    await logControllerDecorator.handle(mockHttpRequest)
    expect(handleSpy).toHaveBeenCalledWith(mockHttpRequest)
  })

  test('Return the same result of the controller', async () => {
    const { logControllerDecorator } = mockSignup()

    const httpResponse = await logControllerDecorator.handle(mockHttpRequest)
    expect(httpResponse).toEqual(ok(mockHttpRequest))
  })

  test('Call Log error repository with correct error', async () => {
    const { signUpController, logControllerDecorator, logErrorRepository } = mockSignup()

    jest.spyOn(signUpController, 'handle').mockReturnValueOnce(Promise.resolve(mockError()))
    const logSpy = jest.spyOn(logErrorRepository, 'log')
    await logControllerDecorator.handle(mockHttpRequest)

    expect(logSpy).toHaveBeenCalledWith('fake_error')
  })
})
