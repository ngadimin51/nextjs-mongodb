import React from 'react'

interface Users {
    _id: string;
    name: string;
    age: number;
}

export default function FormAddUser({
    update, setMessage, success, setUpdate
}:{
    update:boolean|Users;
    setMessage: (e:string) => void;
    success: () => void;
    setUpdate: () => void;
}) {

    const submitUser = async (data:FormData) => {
        const name:FormDataEntryValue | null = data.get('name')
        const age:FormDataEntryValue | null = data.get('age')
        const confirm:FormDataEntryValue | null = data.get('confirm')
        if ( !name ) return setMessage('Check your input name')
        if ( !age ) return setMessage('Check your input age')
        const ageNumber = parseInt(age.toString(), 10)
        if ( isNaN(ageNumber) || ageNumber <= 0 ) return setMessage('Check your input age, min is 1')
        if ( !confirm || confirm !== 'on' ) return setMessage('Please check the checkbox')
        try {
            let method = "POST"
            let dataPost = {name, age, confirm}
            if ( typeof update === "object" ) {
                method = "PATCH"
                dataPost = {_id: update._id, name, age, confirm} as any; // Allow _id temporarily
            }
            const response = await fetch('/api', {
                method: method, headers: {
                    'content-type':'application/json'
                }, body: JSON.stringify(dataPost)
            });
            const data = await response.json();
            setMessage(data.msg)
            if ( response.status === 200 ) success()
        } catch (error) {
            setMessage("error post data, please check the console")
            console.error('Error fetching data:', error);
        } finally {
            const form:HTMLFormElement | null = document.querySelector('#formUser')
            if ( form ) form.reset()
            setUpdate()
        }
    }

    return <form
        action={submitUser}
        className="w-full max-w-sm bg-white px-2 py-2 rounded shadow-md my-4"
        id="formUser"
    >
        <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                    Full Name
                </label>
            </div>
            <div className="md:w-2/3">
                <input
                    id="name"
                    name="name"
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    defaultValue={typeof update === "object" && update?._id ? update?.name : ""}
                    placeholder="Your Name" />
            </div>
        </div>
        <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-password">
                    Age
                </label>
            </div>
            <div className="md:w-2/3">
                <input
                    name="age"
                    id="inline-password"
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="number"
                    defaultValue={typeof update === "object" && update?._id ? update?.age : ""}
                    placeholder="Your Age" />
            </div>
        </div>
        <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3"></div>
            <label className="md:w-2/3 block text-gray-500 font-bold">
                <input className="mr-2 leading-tight" type="checkbox" name="confirm" />
                <span className="text-sm">
                    My Data is corrected!
                </span>
            </label>
        </div>
        <div className="flex justify-between items-center">
            <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded text-xs" type="submit">
                submit
            </button>
            <button
                className="shadow bg-lime-500 hover:bg-lime-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded text-xs mb-1"
                type="button"
                onClick={() => setUpdate()}
            >cancel</button>
        </div>
    </form>
}
