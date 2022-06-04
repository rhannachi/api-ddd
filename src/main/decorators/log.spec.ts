import { ILogErrorRepository } from '../../data/protocols'
import { serverError } from '../../presentation/helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface IMakeSignup {
  signUpController: SignUpControllerMock
  signUpControllerWithLog: LogControllerDecorator
  logErrorRepository: LogErrorRepositoryMock
}
class SignUpControllerMock implements IController {
  async handle (httprequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse: IHttpResponse = {
      statusCode: 200,
      body: {
        name: 'ramzi'
      }
    }

    return await Promise.resolve(httpResponse)
  }
}

class LogErrorRepositoryMock implements ILogErrorRepository {
  async log (stack: string): Promise<void> {
    return await Promise.resolve()
  }
}

const makeFakeError = (): Error => {
  const error = new Error()
  error.stack = 'fake_error'
  return error
}

const makeSignup = (): IMakeSignup => {
  const signUpController = new SignUpControllerMock()
  const logErrorRepository = new LogErrorRepositoryMock()
  const signUpControllerWithLog = new LogControllerDecorator(
    signUpController, logErrorRepository
  )

  return {
    signUpController,
    signUpControllerWithLog,
    logErrorRepository
  }
}

describe('Log Controller Decorator', () => {
  test('Should call function handle from the Controller', async () => {
    const { signUpController, signUpControllerWithLog } = makeSignup()

    const handleSpy = jest.spyOn(signUpController, 'handle')
    const httpRequest: IHttpRequest = {
      body: {
        email: 'mail@mail.com',
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    await signUpControllerWithLog.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Return the same result of the controller', async () => {
    const { signUpControllerWithLog } = makeSignup()

    const httpRequest: IHttpRequest = {
      body: {
        email: 'mail@mail.com',
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = await signUpControllerWithLog.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'ramzi'
      }
    })
  })

  test('Call Log error repository with correct error', async () => {
    const { signUpController, signUpControllerWithLog, logErrorRepository } = makeSignup()
    const error = makeFakeError()

    jest.spyOn(signUpController, 'handle').mockReturnValueOnce(Promise.resolve(serverError(error)))
    const logSpy = jest.spyOn(logErrorRepository, 'log')

    const httpRequest: IHttpRequest = {
      body: {
        email: 'mail@mail.com',
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    await signUpControllerWithLog.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('fake_error')
  })
})
