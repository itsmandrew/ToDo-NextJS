import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user.todos);
    } catch (error) {
        console.error('GET /api/todos error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title } = await request.json();
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { $push: { todos: { title } } },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user.todos[user.todos.length - 1], { status: 201 });
    } catch (error) {
        console.error('POST /api/todos error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, completed } = await request.json();
        const user = await User.findOneAndUpdate(
            { email: session.user.email, 'todos._id': id },
            { $set: { 'todos.$.completed': completed } },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        const updatedTodo = user.todos.find(todo => todo._id.toString() === id);
        return NextResponse.json(updatedTodo);
    } catch (error) {
        console.error('PUT /api/todos error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await request.json();
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { $pull: { todos: { _id: id } } },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/todos error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}