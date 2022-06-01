import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

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

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const signUpController = new SignUpControllerMock()
    const handleSpy = jest.spyOn(signUpController, 'handle')
    const signUpControllerWithLog = new LogControllerDecorator(signUpController)
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
})
