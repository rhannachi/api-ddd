import validator from 'validator'
import { EmailValidatorAdapter } from './emailValidator.adapter'

const makeEmailValidatorAdapter = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator', () => {
  test('return false if validator returns false', () => {
    const emailValidator = makeEmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = emailValidator.isValid('invalid_email@gmail.com')
    expect(isValid).toBe(false)
  })

  test('return true if validator returns true', () => {
    const emailValidator = makeEmailValidatorAdapter()
    const isValid = emailValidator.isValid('valid_email@gmail.com')
    expect(isValid).toBe(true)
  })

  test('call validator with correct email', () => {
    const emailValidator = makeEmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    emailValidator.isValid('email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('email@gmail.com')
  })
})
