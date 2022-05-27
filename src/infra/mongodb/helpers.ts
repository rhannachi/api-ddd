import { Collection, MongoClient } from "mongodb";

export default abstract class MongoHelper {
  static client: MongoClient;

  static async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  }

  static async disconnect(): Promise<void> {
    await this.client.close();
  }

  static getCollection(name: string): Collection {
    return this.client.db().collection(name);
  }

  static mapDocument<T>(document: any): T {
    const { _id, ...documentWithoutId } = document;
    return Object.assign({}, documentWithoutId, { id: _id });
  }
}
