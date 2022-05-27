import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const config = {
  instance: {
    dbName: process.env.DB_NAME,
  },
};

export default abstract class MongoHelper {
  private static mongoServer: MongoMemoryServer;

  static async connect(): Promise<void> {
    this.mongoServer = await MongoMemoryServer.create(config);

    // TODO custom error
    if (!this.mongoServer) {
      throw new Error("connect: DB connection failed");
    }

    await mongoose.connect(this.mongoServer.getUri());
  }

  static async disconnect(): Promise<void> {
    await mongoose.disconnect();
    if (this.mongoServer) {
      await this.mongoServer.stop();
    }
  }
}
