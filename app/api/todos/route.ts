import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'


export async function GET() {
    const client = await clientPromise
    const collection = client.db("todoapp").collection("todos")
    const todos = await collection.find({}).toArray()
    return NextResponse.json(todos)
}

export async function POST(request: Request) {
    const { title } = await request.json()
    const client = await clientPromise
    const collection = client.db("todoapp").collection("todos")
    const result = await collection.insertOne({ title, completed: false })
    return NextResponse.json(result)
}

export async function PUT(request: Request) {
    const { id, completed } = await request.json()
    const client = await clientPromise
    const collection = client.db("todoapp").collection("todos")
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { completed } }
    )
    return NextResponse.json(result)
}

export async function DELETE(request: Request) {
    const { id } = await request.json()
    const client = await clientPromise
    const collection = client.db("todoapp").collection("todos")
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json(result)
}