import { MissingParamsError } from '../errors'
import { IFieldsValidation, IHttpRequest } from '../protocols'
import { FieldsValidationComposite } from './fieldsValidationComposite'

describe('Validation Composite', () => {
  test('Error if validation faild', async () => {
    class FieldsValidation implements IFieldsValidation {
      validate(_input: IHttpRequest['body']) {
        return new MissingParamsError('field')
      }
    }

    const fieldValidation = new FieldsValidation()
    const fieldsValidationComposite = new FieldsValidationComposite([
      fieldValidation,
    ])
    const error = fieldsValidationComposite.validate({ field: 'value' })

    expect(error).toEqual(new MissingParamsError('field'))
  })
})
