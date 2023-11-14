import { connectToDatabase, startMongoSession, closeConnection } from '@/lib/db';
const collectionName:string = 'users'
import { ObjectId } from 'mongodb'

export async function deleteUsers({_id}:{_id:string}) {
    const db = await connectToDatabase() // mulai koneksi database
    const timestamp = new Date().getTime()
    console.log(`Connection start ${timestamp}`)
    try {
        const data = await db.collection(collectionName).deleteOne({ _id: new ObjectId(_id) });
        if ( data.deletedCount > 0 ) {
            return {
                error: false,
                msg: `Berhasil menghapus data`,
                data: data
            }
        }
        return {
            error: true,
            msg: `Gagal menghapus data`,
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
        console.log(`Connection end ${timestamp}`)
        closeConnection() // menutup koneksi
    }
}
