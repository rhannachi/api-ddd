import { Collection, MongoClient } from "mongodb";

export default abstract class MongoHelper {
  static client: MongoClient;

  static async connect(uri: string) {
    this.client = await MongoClient.connect(uri);
  }

  static async disconnect() {
    await this.client.close();
  }

  static getCollection(name: string): Collection {
    return this.client.db().collection(name);
  }
}
