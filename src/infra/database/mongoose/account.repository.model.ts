import { model, Schema } from 'mongoose'
import { AccountModel } from '../../../domain/models'

interface AccountModelDoc extends AccountModel, Document {}

const AccountSchemaFields: Record<keyof Omit<AccountModel, 'id'>, any> = {
  name: String,
  email: String,
  password: String
}

const AccountSchema: Schema = new Schema(AccountSchemaFields)

// TODO rename this
export const AccountModelMongoose = model<AccountModelDoc>('Account', AccountSchema)
