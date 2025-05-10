import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Email from '@/models/Email';

// Function to decode JWT without verification (reused from existing code)
function decodeJwt(token: string) {
    try {
        // Split the token into parts
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token structure');
        }

        // Base64Url decode the payload (second part)
        const payload = parts[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString();

        // Parse and return the decoded JSON
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

export async function PATCH(request: Request) {
    try {
        // Connect to database
        await connectToDatabase();

        // Get request body with email ID
        const body = await request.json();
        const { emailId } = body;

        if (!emailId) {
            return NextResponse.json({ error: 'Email ID is required' }, { status: 400 });
        }

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

        // Check if email exists in inbox
        const emailExists = user.inbox.includes(emailId);

        if (!emailExists) {
            return NextResponse.json({ error: 'Email not found in inbox' }, { status: 404 });
        }

        // Remove email from inbox and add to opened
        await User.findByIdAndUpdate(
            userId,
            {
                $pull: { inbox: emailId },
                $addToSet: { opened: emailId }  // Using $addToSet to avoid duplicates
            }
        );

        // Update the read status on the email itself (optional)
        await Email.findByIdAndUpdate(emailId, { read: true });

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Email marked as read and moved to opened emails'
        }, { status: 200 });
    } catch (error) {
        console.error('Error marking email as read:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
