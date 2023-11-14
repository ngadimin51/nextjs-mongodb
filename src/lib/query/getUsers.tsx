import { connectToDatabase, startMongoSession } from '@/lib/db';
const collectionName:string = 'users'

export async function getUsers({
    name = '', limit = 10
}: {
    name?: string;
    limit?: number;
} = {}) {
    let filter = {}
    if ( name ) {
        filter = {
            name: { $regex: new RegExp(name, "i") }
        }
    }
    const session = await startMongoSession();
    const timestamp = new Date().getTime()
    console.log(`Session start ${timestamp}`)
    try {
        const data = await session.withTransaction(async () => { // menggunakan session untuk pengelolaan abortTransaction dan close
            const db = await connectToDatabase(); // koneksi database
            const collection = db.collection(collectionName); // Ganti dengan nama collection Anda
            return await collection.find(filter).limit(limit).toArray(); // Menghasilkan data berupa array
        });
        return {
            error: false,
            msg: `Mendapatkan ${data.length} data`,
            data: data
        }
    } catch (error) {
        console.log(error)
        return {
            error: true,
            msg: "Error, Periksa log server",
            data: []
        }
    } finally {
        console.log(`Session close ${timestamp}`)
        session.endSession(); // menutup sesi
    }
}
