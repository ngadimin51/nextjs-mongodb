'use client'
import { useState, useEffect, ChangeEvent } from 'react';
import FormAddUser from './FormAddUser';
import FilterUser from './FilterUser';

interface Users {
  _id: string;
  name: string;
  age: number;
}

export default function GetData() {
    const [message, setMessage] = useState<string>('')
    const [data, setData] = useState<Users[]>([])
    const [update, setUpdate] = useState<Users|boolean>(false)
    const [form, setForm] = useState(false)
    const [filter, setFilter] = useState('')
    const [isDelete, setIsDelete] = useState<{_id:string|null;ok:boolean}>({_id:null,ok:false})

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
        if ( isDelete._id === _id && isDelete.ok === true ) {
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
        } else if ( isDelete._id !== _id ) {
            setIsDelete({_id: _id, ok:false})
        } else {
            setMessage('Please check the checkbox')
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

    useEffect(() => {
        setIsDelete({_id:null, ok:false})
    }, [form])
    

    return <div className="min-h-[100vh] px-2 py-2">
        <div>
            <button onClick={fetchData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded me-2 text-xs">Load Data</button>
            { !form && <button onClick={() => setForm(true)} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded me-2 text-xs">Tambah Data</button> }
        </div>

        {message && message.length > 0 && <div className="mt-2 px-2 py-2 bg-orange-50 shadow-md rounded">
            <div className="flex justify-between items-center">
                <div className="" dangerouslySetInnerHTML={{ __html: message }} />
                <button onClick={() => setMessage('')} className="w-[32px] h-[32px] border rounded-full bg-neutral-100">x</button>
            </div>
        </div>}

        { form ? <FormAddUser
            update={update}
            setMessage={(e:string) => setMessage(e)}
            success={fetchData}
            setUpdate={() => {
            setUpdate(false)
            setForm(false)
        }} /> : <div className="bg-white shadow-md px-2 py-3 my-4">
            <FilterUser filter={ (e:string) => setFilter(e)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                { Array.isArray(data) && data.map( (x:Users, i:number) => <div key={i} className="border rounded px-3 py-2 mt-2 mb-1 shadow-md">
                    <div className="flex justify-between items-start pt-3">
                        <div>
                            <div className="absolute bg-red-100 px-2 rounded mt-[-30px] font-bold">USER - {x._id}</div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td className="px-2">:</td>
                                        <td>{x.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Age</td>
                                        <td className="px-2">:</td>
                                        <td>{x.age}</td>
                                    </tr>
                                </tbody>
                            </table>
                            { isDelete._id === x._id && <div className="md:flex md:items-center my-2 bg-red-500 rounded px-3 py-2">
                                <label className="block text-white">
                                    <input className="mr-2 leading-tight" type="checkbox" name="confirm" onChange={(e:ChangeEvent<HTMLInputElement>) => {
                                        if ( e.target.checked ) setIsDelete({_id:x._id, ok:true})
                                    }} />
                                    <span className="text-sm">
                                        Yes, delete this data!
                                    </span>
                                </label>
                            </div>}
                        </div>
                        <div>
                            <button
                                className="me-1 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded text-xs"
                                type="button"
                                onClick={() => {
                                    setUpdate(x)
                                    setForm(true)
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </button>
                            <button
                                className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mt-1 text-xs"
                                type="button"
                                onClick={() => deleteUser(x._id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>)}
            </div>
        </div> }
    </div>
}
