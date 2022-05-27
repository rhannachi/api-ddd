import { MongoMemoryServer } from "mongodb-memory-server";
import { Collection, MongoClient } from "mongodb";

const config = {
  instance: {
    dbName: process.env.DB_NAME,
  },
};

export default abstract class MongoHelper {
  private static client: MongoClient;
  private static mongoServer: MongoMemoryServer;
  private static dbName: string;

  static async connect(): Promise<void> {
    this.mongoServer = await MongoMemoryServer.create(config);

    // TODO custom error
    if (!this.mongoServer) {
      throw new Error("connect: DB connection failed");
    }

    const dbName = this.mongoServer.instanceInfo?.dbName;

    // TODO custom error
    if (!dbName) {
      throw new Error("getCollectionn: DB connection failed");
    }
    this.dbName = dbName;
    this.client = await MongoClient.connect(this.mongoServer.getUri());
  }

  static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
    if (this.mongoServer) {
      await this.mongoServer.stop();
    }
  }

  static getCollection(name: string): Collection {
    return this.client.db(this.dbName).collection(name);
  }

  static mapDocument<T>(document: any): T {
    const { _id, ...documentWithoutId } = document;
    return Object.assign({}, documentWithoutId, { id: _id });
  }
}
