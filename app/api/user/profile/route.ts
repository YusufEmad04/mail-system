import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// Reuse the JWT decoding function
function decodeJwt(token: string) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token structure');
        }
        const payload = parts[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString();
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

export async function GET() {
    try {
        // Connect to database
        await connectToDatabase();

        // Get user ID from cookie
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
        }

        // Decode JWT token to get user ID without verification
        const decodedToken = decodeJwt(token.value);

        if (!decodedToken || !decodedToken.id) {
            return NextResponse.json({ error: 'Invalid token - Cannot extract user ID' }, { status: 401 });
        }

        const userId = decodedToken.id;

        // Find user by ID
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return user data (excluding sensitive information like password)
        return NextResponse.json({
            id: user._id,
            name: user.name,
            email: user.email
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
