import { InvalidParamsError } from '../errors'
import { CompareFieldsValidation } from './compareFieldsValidation'

describe('Compare Fields Validation', () => {
  test('Missing params error if faild validation', async () => {
    const compareFieldsValidation = new CompareFieldsValidation(
      'field1',
      'field2'
    )
    const error = compareFieldsValidation.validate({
      field1: 'value1',
      field2: 'value2',
    })

    expect(error).toEqual(new InvalidParamsError('field2'))
  })

  test('Not return if faild validation success', async () => {
    const compareFieldsValidation = new CompareFieldsValidation(
      'field1',
      'field2'
    )
    const error = compareFieldsValidation.validate({
      field1: 'value',
      field2: 'value',
    })

    expect(error).toBeFalsy()
  })
})
