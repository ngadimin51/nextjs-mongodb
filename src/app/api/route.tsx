// pages/api/getData.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/query/getUsers';
import { postUsers } from '@/lib/query/postUsers';
import { updateUsers } from '@/lib/query/updateUsers';
import { deleteUsers } from '@/lib/query/deleteUsers';

export async function GET(req: NextRequest) {

    console.log(`>> GET USER`)

    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter')

    if ( filter ) {
        const _getUsers = await getUsers({name: filter})
        console.log(`>> FILTER: ${filter}`)
        return NextResponse.json({ msg: _getUsers.msg, data: _getUsers.data })
    }

    const _getUsers = await getUsers()
    return NextResponse.json({ msg: _getUsers.msg, data: _getUsers.data })
}

export async function POST(req: NextRequest) {
    const { name, age } = await req.json()
    const _postUsers = await postUsers({ name, age })
    if ( _postUsers.error ) {
        return NextResponse.json({ msg: _postUsers.msg, data: _postUsers.data },{ status: 401 })
    }
    console.log(`>> SUCCESS ADD USER`)
    console.log({ name, age })
    return NextResponse.json({ msg: _postUsers.msg, data: _postUsers.data })
}

export async function PATCH(req: NextRequest) {
    const { _id, name, age } = await req.json()
    const _updateUsers = await updateUsers({ _id, name, age })
    if ( _updateUsers.error ) {
        return NextResponse.json({ msg: _updateUsers.msg, data: _updateUsers.data },{ status: 401 })
    }
    console.log(`>> SUCCESS UPDATE USER`)
    console.log({ _id, name, age } )
    return NextResponse.json({ msg: _updateUsers.msg, data: _updateUsers.data })
}

export async function DELETE(req: NextRequest) {
    const { _id } = await req.json()
    const _deleteUsers = await deleteUsers({ _id })
    if ( _deleteUsers.error ) {
        return NextResponse.json({ msg: _deleteUsers.msg, data: _deleteUsers.data },{ status: 401 })
    }
    console.log(`>> SUCCESS DELETE USER`)
    console.log({ _id })
    return NextResponse.json({ msg: _deleteUsers.msg, data: _deleteUsers.data })
}