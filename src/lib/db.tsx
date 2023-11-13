// ts-mongodb-config.ts
import { MongoClient, Db } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

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