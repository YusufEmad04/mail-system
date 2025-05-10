import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Email from '@/models/Email';
import User from '@/models/User';

// Function to decode JWT without verification
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

export async function GET(request: Request) {
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

        // Find user by ID and populate inbox and opened arrays with full email documents
        const user = await User.findById(userId)
            .populate({
                path: 'inbox',
                options: { sort: { createdAt: -1 } }
            })
            .populate({
                path: 'opened',
                options: { sort: { createdAt: -1 } }
            });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get all emails sent by the user
        const sentEmails = await Email.find({
            from: user.email
        }).sort({ createdAt: -1 });

        // Enhance inbox emails with sender information
        const enhancedInbox = await Promise.all(user.inbox.map(async (email: any) => {
            const senderUser = await User.findOne({ email: email.from });
            return {
                ...email.toObject(),
                senderName: senderUser?.name || 'Unknown User',
                senderEmail: email.from
            };
        }));

        // Enhance opened emails with sender information
        const enhancedOpened = await Promise.all(user.opened.map(async (email: any) => {
            const senderUser = await User.findOne({ email: email.from });
            return {
                ...email.toObject(),
                senderName: senderUser?.name || 'Unknown User',
                senderEmail: email.from
            };
        }));

        // Enhance sent emails with sender information (which is the current user)
        const enhancedSent = sentEmails.map((email) => {
            return {
                ...email.toObject(),
                senderName: user.name,
                senderEmail: user.email
            };
        });

        // Return the enhanced emails
        return NextResponse.json({
            inbox: enhancedInbox,
            opened: enhancedOpened,
            sent: enhancedSent
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching emails:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    console.log('Creating email...');
    try {
        // Connect to database
        await connectToDatabase();

        // Get request body
        const body = await request.json();

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

        // Create new email
        const newEmail = await Email.create({
            from: user.email,
            to: body.to,
            cc: body.cc || [],
            bcc: body.bcc || [],
            subject: body.subject,
            message: body.message,
            attachments: body.attachments || [],
        });

        // Update inbox of recipients
        for (const recipientEmail of body.to) {
            try {
                // Find recipient user by email
                const recipientUser = await User.findOne({ email: recipientEmail });

                // If user exists, add email ID to their inbox
                if (recipientUser) {
                    await User.findByIdAndUpdate(
                        recipientUser._id,
                        { $push: { inbox: newEmail._id } }
                    );
                }
                // Skip if user doesn't exist
            } catch (error) {
                console.error(`Error updating inbox for ${recipientEmail}:`, error);
                // Continue with the loop even if one update fails
            }
        }

        return NextResponse.json({ success: true, email: newEmail }, { status: 201 });
    } catch (error) {
        console.error('Error creating email:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}