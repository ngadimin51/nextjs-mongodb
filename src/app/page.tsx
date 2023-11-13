import GetData from '../components/home/GetData';
import { getUsers } from '@/lib/query/getUsers';

async function getDataUsers() {
  let data = await getUsers()
  if ( Array.isArray(data?.data) ) {
    const dataUser = data.data.map((x:any) => {
      return {
        _id: x._id?.toString(),
        name: x.name,
        age: x.age
      }
    })
    return dataUser
  }
  return []
}

export default async function Home() {
  const data:any = await getDataUsers()
  return <GetData dataUser={data} />
}
