import { connectToDatabase, startMongoSession } from '@/lib/db';
const collectionName:string = 'users'

export async function postUsers({name, age}:{name:string;age:number}) {
    name = name.trim()
    const session = await startMongoSession();
    const timestamp = new Date().getTime()
    console.log(`Session start ${timestamp}`)
    try {
        return await session.withTransaction(async () => { // menggunakan session untuk pengelolaan abortTransaction dan close
            const db = await connectToDatabase(); // koneksi database
            const existingUser = await db.collection(collectionName).findOne({ name: name });

            if (existingUser) {
                return {
                    error: true,
                    msg: `User with the same name ${name} already exists.`,
                    data: []
                }
            } else {
                // Insert the new document
                await db.collection(collectionName).createIndex({ name: 1 }, { unique: true });
                const data = await db.collection(collectionName).insertOne({ name, age }); // insert data name dan age
                return {
                    error: false,
                    msg: `Berhasil menambahkan data name:${name} age:${age}`,
                    data: data
                }
            }
        });
    } catch (error) {
        console.log(error)
        return {
            error: true,
            msg: "Error, Periksa log server",
            data: []
        }
    } finally {
        console.log(`Session end ${timestamp}`)
        session.endSession(); // menutup sesi
    }
}
