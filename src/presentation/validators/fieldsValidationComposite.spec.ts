import { MissingParamsError } from '../errors'
import { IFieldsValidation, IHttpRequest } from '../protocols'
import { FieldsValidationComposite } from './fieldsValidationComposite'

// 21:21
const mockFieldsValidation = (): IFieldsValidation => {
  class FieldsValidation implements IFieldsValidation {
    validate(_input: IHttpRequest['body']) {
      return
    }
  }
  return new FieldsValidation()
}

interface IMockValidation {
  fieldsValidationComposite: FieldsValidationComposite
  fieldsValidations: IFieldsValidation[]
}

const mockValidation = (): IMockValidation => {
  const fieldsValidations = [mockFieldsValidation(), mockFieldsValidation()]
  const fieldsValidationComposite = new FieldsValidationComposite(
    fieldsValidations
  )

  return {
    fieldsValidations,
    fieldsValidationComposite,
  }
}

describe('Validation Composite', () => {
  test('Error if validation fails', async () => {
    const { fieldsValidations, fieldsValidationComposite } = mockValidation()
    jest
      .spyOn(fieldsValidations[1], 'validate')
      .mockReturnValueOnce(new MissingParamsError('field'))
    const error = fieldsValidationComposite.validate({ field: 'value' })

    expect(error).toEqual(new MissingParamsError('field'))
  })

  test('First error if validation fails', async () => {
    const { fieldsValidations, fieldsValidationComposite } = mockValidation()
    jest
      .spyOn(fieldsValidations[0], 'validate')
      .mockReturnValueOnce(new Error())
    jest
      .spyOn(fieldsValidations[1], 'validate')
      .mockReturnValueOnce(new MissingParamsError('field'))
    const error = fieldsValidationComposite.validate({ field: 'value' })

    expect(error).toEqual(new Error())
  })

  test('Not return error if validation success', async () => {
    const { fieldsValidationComposite } = mockValidation()
    const error = fieldsValidationComposite.validate({ field: 'value' })

    expect(error).toBeFalsy()
  })
})
