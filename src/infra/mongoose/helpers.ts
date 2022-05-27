import mongoose, { Connection } from "mongoose";

export default abstract class MongoHelper {
  static client: Connection;

  static async connect(uri: string): Promise<void> {
    this.client = (await mongoose.connect(uri)).connection;
  }

  static async disconnect(): Promise<void> {
    await this.client.close();
  }
}
