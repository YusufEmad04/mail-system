import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define public paths that don't require authentication
const publicPaths = ['/', '/create-account', '/api/auth/login', '/api/auth/signup'];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the path is public
    const isPublicPath = publicPaths.some(publicPath =>
        path === publicPath || path.startsWith('/api/auth/')
    );

    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    // If the path is public, allow access regardless of authentication
    if (isPublicPath) {
        return NextResponse.next();
    }

    // If there's no token and the path is not public, redirect to login
    if (!token) {
        const url = new URL('/', request.nextUrl.origin);
        return NextResponse.redirect(url);
    }

    try {
        // Verify the token
        const JWT_SECRET = new TextEncoder().encode(
            process.env.JWT_SECRET || 'your-secret-key'
        );

        await jwtVerify(token, JWT_SECRET);

        // If token is valid, allow access to the requested page
        return NextResponse.next();
    } catch (error) {
        // If token verification fails, redirect to login
        const url = new URL('/', request.nextUrl.origin);
        return NextResponse.redirect(url);
    }
}

// Define which routes this middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
    ],
};
