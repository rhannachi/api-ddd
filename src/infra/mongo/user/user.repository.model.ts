import { model, Schema } from 'mongoose'
import { IUserModel } from '../../../domain/user'

interface IUserModelDoc extends IUserModel, Document {}

const UserSchemaFields: Record<keyof Omit<IUserModel, 'id'>, any> = {
  name: String,
  email: String,
  password: String
}

const UserSchema: Schema = new Schema(UserSchemaFields)

// TODO rename this
export const UserModelMongo = model<IUserModelDoc>('User', UserSchema)
