import { model, Schema } from 'mongoose'
import { IAccountModel } from '../../../domain/models'

interface IAccountModelDoc extends IAccountModel, Document {}

const AccountSchemaFields: Record<keyof Omit<IAccountModel, 'id'>, any> = {
  name: String,
  email: String,
  password: String
}

const AccountSchema: Schema = new Schema(AccountSchemaFields)

// TODO rename this
export const AccountModelMongoose = model<IAccountModelDoc>('Account', AccountSchema)
