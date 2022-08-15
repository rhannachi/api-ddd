import { MissingParamsError } from '../errors'
import { RequiredFieldValidation } from './requiredFieldValidation'

describe('Required Field Validation', () => {
  test('Missing params error if faild validation', async () => {
    const requiredFieldValidation = new RequiredFieldValidation('field')
    const error = requiredFieldValidation.validate({ name: 'name' })

    expect(error).toEqual(new MissingParamsError('field'))
  })

  test('Not return if faild validation success', async () => {
    const requiredFieldValidation = new RequiredFieldValidation('name')
    const error = requiredFieldValidation.validate({ name: 'name' })

    expect(error).toEqual(null)
  })
})
