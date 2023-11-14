import { connectToDatabase, startMongoSession } from '@/lib/db';
import { ObjectId } from 'mongodb'
const collectionName:string = 'users'
// tambahkan mutex jika perlu

export async function updateUsers({_id, name, age}:{_id:string;name:string;age:number}) {
    name = name.trim()
    const session = await startMongoSession();
    const timestamp = new Date().getTime()
    console.log(`Session start ${timestamp}`)
    try {
        return await session.withTransaction(async () => { // menggunakan session untuk pengelolaan abortTransaction dan close
            const db = await connectToDatabase(); // koneksi database
            const data = await db.collection(collectionName).updateOne(
                { _id: new ObjectId(_id) }, // specify the filter based on your use case
                {
                    $set: {
                        name: name,
                        age: age,
                    },
                }
            );
            if (data.modifiedCount > 0) {
                return {
                    error: false,
                    msg: `Berhasil memperbarui data`,
                    data: data
                }
            } else {
                return {
                    error: true,
                    msg: `Gagal memperbarui data`,
                    data: data
                }
            }
        });
    } catch (error) {
        console.log(error)
        if ((error as { keyPattern?: Record<string, unknown> }).keyPattern) {
            const keyPattern = (error as { keyPattern: Record<string, unknown> }).keyPattern;
            return {
                error: true,
                msg: `Terkendala dengan duplikasi data ${Object.keys(keyPattern)} : ${Object.values(
                    keyPattern
                )}`,
                data: []
            };
        }
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
