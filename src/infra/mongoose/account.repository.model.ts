import { model, Schema } from 'mongoose'
import { AccountModel } from '../../domain/models/account'

interface AccountModelDoc extends AccountModel, Document {}

const AccountSchemaFields: Record<keyof Omit<AccountModel, 'id'>, any> = {
  name: String,
  email: String,
  password: String
}

const AccountSchema: Schema = new Schema(AccountSchemaFields)

export default model<AccountModelDoc>('Account', AccountSchema)
