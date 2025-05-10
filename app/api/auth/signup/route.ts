import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, password } = body;

        // Connect to the database
        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }

        // Create new user
        const user = await User.create({
            name: `${firstName} ${lastName}`,
            email,
            password,
            inbox: [],
            opened: []
        });

        // Return user data (without password)
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        return NextResponse.json({
            message: 'User created successfully',
            user: userData
        }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
