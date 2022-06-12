import { IUserModel } from '@/domain/user'
import { model, Schema } from 'mongoose'

interface IUserModelDoc extends IUserModel, Document {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserSchemaFields: Record<keyof Omit<IUserModel, 'id'>, any> = {
  name: String,
  email: String,
  password: String,
}

const UserSchema: Schema = new Schema(UserSchemaFields)

// TODO rename this
export const UserModelMongo = model<IUserModelDoc>('User', UserSchema)
