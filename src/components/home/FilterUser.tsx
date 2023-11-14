import React from 'react'
let timeout:any

export default function FilterUser({
    filter
}:{
    filter:(value:string) => void;
}) {

    const result = (e:React.KeyboardEvent<HTMLInputElement>) => {
        const value = (e.target as HTMLInputElement).value;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            filter(value);
        }, 500);
    };

    return <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-2">
        <div>
            <div>
                <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                    Filter User
                </label>
            </div>
            <div>
                <input
                    id="name"
                    name="name"
                    className="bg-neutral-100 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Your Name"
                    onKeyUp={(e:React.KeyboardEvent<HTMLInputElement>) => result(e)}
                />
            </div>
        </div>
    </div>
}
