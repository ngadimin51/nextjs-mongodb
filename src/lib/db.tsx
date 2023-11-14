// ts-mongodb-config.ts
import { MongoClient, Db } from 'mongodb';

// localhost
const client = new MongoClient(process.env.mongoURI || '');

export async function connectToDatabase(): Promise<Db> {
    await client.connect();
    return client.db('test'); // Sesuaikan dengan nama database anda
}

export async function startMongoSession() {
    return client.startSession(); // Start session
}

export async function closeConnection(): Promise<void> {
    await client.close(); // close connection
}