import { ILogErrorRepository } from '@/application/protocols'
import { ok, serverError } from '@/presentation/controllers/http'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '../../presentation/protocols'
import { LogDecorator } from './log'

interface IMockSignup {
  signUpController: SignUpControllerMock
  logDecorator: LogDecorator
  logErrorRepository: LogErrorRepositoryMock
}
class SignUpControllerMock implements IController {
  async handle(): Promise<IHttpResponse> {
    return await Promise.resolve(ok(mockHttpRequest))
  }
}

class LogErrorRepositoryMock implements ILogErrorRepository {
  async log(): Promise<void> {
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
  const logDecorator = new LogDecorator(signUpController, logErrorRepository)

  return {
    signUpController,
    logDecorator,
    logErrorRepository,
  }
}

const mockHttpRequest: IHttpRequest = {
  body: {
    email: 'email@gmail.com',
    name: 'name',
    password: 'password',
    passwordConfirmation: 'password',
  },
}

describe('Log Decorator Controller', () => {
  test('Call function handle from the Controller', async () => {
    const { signUpController, logDecorator } = mockSignup()

    const handleSpy = jest.spyOn(signUpController, 'handle')
    await logDecorator.handle(mockHttpRequest)
    expect(handleSpy).toHaveBeenCalledWith(mockHttpRequest)
  })

  test('Return the same result of the controller', async () => {
    const { logDecorator } = mockSignup()

    const httpResponse = await logDecorator.handle(mockHttpRequest)
    expect(httpResponse).toEqual(ok(mockHttpRequest))
  })

  test('Call Log error repository with correct error', async () => {
    const { signUpController, logDecorator, logErrorRepository } = mockSignup()

    jest
      .spyOn(signUpController, 'handle')
      .mockReturnValueOnce(Promise.resolve(mockError()))
    const logSpy = jest.spyOn(logErrorRepository, 'log')
    await logDecorator.handle(mockHttpRequest)

    expect(logSpy).toHaveBeenCalledWith('fake_error')
  })
})
