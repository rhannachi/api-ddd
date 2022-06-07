import { model, Schema } from 'mongoose'

// TODO create interface in data or ...
interface ILogModelDoc extends Document {
  stack: string
  date: Date
}

const LogSchema: Schema = new Schema<ILogModelDoc>({
  stack: String,
  date: Date
})

// TODO rename this
export const LogModelMongoose = model<ILogModelDoc>('Errors', LogSchema)
