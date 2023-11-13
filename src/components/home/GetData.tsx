'use client'
import { useState, useEffect } from 'react';
import FormAddUser from './FormAddUser';
import FilterUser from './FilterUser';

interface Users {
  _id: string;
  name: string;
  age: number;
}

export default function GetData({dataUser}:{dataUser:Users[]}) {
    const [message, setMessage] = useState<string>('')
    const [data, setData] = useState(dataUser)
    const [update, setUpdate] = useState<Users|boolean>(false)
    const [form, setForm] = useState(false)
    const [filter, setFilter] = useState('')

    const fetchData = async () => {
        try {
            const response = await fetch('/api');
            const data = await response.json();
            setMessage(data.msg)
            setData(data.data)
            setForm(false)
            setUpdate(false)
        } catch (error) {
            setMessage("error port data, please check the console")
            console.error('Error fetching data:', error);
        }
    }

    const clear = () => {
        setData([])
        setMessage('')
    }

    const deleteUser = async (_id:string) => {
        try {
            const response = await fetch('/api', {
                method: 'DELETE', headers: {
                    'content-type': 'application/json'
                }, body: JSON.stringify({_id})
            });
            const data = await response.json();
            setMessage(data.msg)
            if ( response.status === 200 ) fetchData()
        } catch (error) {
            setMessage("error port data, please check the console")
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        async function filterUser() {
            const response = await fetch('/api?filter='+filter)
            const data = await response.json()
            setData(data.data)
        }
        if ( filter && filter.length > 0 ) {
            filterUser()
        }
    }, [filter])
    

    return <div className="min-h-[100vh] px-2 py-2">
        <div>
            <button onClick={fetchData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded me-2 text-xs">FETCH</button>
            <button onClick={clear} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded me-2 text-xs">CLEAR</button>
            { !form && <button onClick={() => setForm(true)} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded me-2 text-xs">ADD</button> }
        </div>

        {message && message.length > 0 && <div className="mt-2 px-2 py-2 bg-orange-50 rounded">{ message }</div>}

        <FilterUser filter={ (e:string) => setFilter(e)} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            { Array.isArray(data) && data.map( (x:Users, i:number) => <div key={i} className="bg-white rounded px-2 py-2 mt-2">
                <div className="flex justify-between items-start">
                    <div>
                        Name: {x.name}
                        <br />
                        Age: {x.age}
                    </div>
                    <div>
                        <div>
                            <button
                                className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded text-xs"
                                type="button"
                                onClick={() => {
                                    setUpdate(x)
                                    setForm(true)
                                }}
                            >UPDATE</button>
                        </div>
                        <button
                            className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mt-1 text-xs"
                            type="button"
                            onClick={() => deleteUser(x._id)}
                        >DELETE</button>
                    </div>
                </div>
            </div>)}
        </div>

        { form && <FormAddUser
            update={update}
            setMessage={(e:string) => setMessage(e)}
            success={fetchData}
            setUpdate={() => {
            setUpdate(false)
            setForm(false)
        }} /> }
    </div>
}
