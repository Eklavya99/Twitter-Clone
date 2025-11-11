import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    console.log('Middleware invoked for:', req.url);
    const { pathname } = req.nextUrl;

    if(
        pathname.startsWith('/auth') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname === '/favicon.ico' ||
        pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|css|js)$/)
    ){
        return NextResponse.next();
    }

    const backendBase = process.env.BACKEND_BASE_URL || 'http://localhost:5000';
    const healthCheckUrl = new URL('/health', backendBase);

    try{
        const res = await fetch(healthCheckUrl.toString(), {
            method: 'GET',
            headers: {
                cookie : req.headers.get('cookie') || '',
            },
        });

        if(!res.ok){
            const login = new URL('/auth/login', req.url);
            return NextResponse.redirect(login);
        }
        return NextResponse.next();
    }
    catch(error){
        console.error('Health check failed:', error);
        const login = new URL('/auth/login', req.url);
        return NextResponse.redirect(login);
    }
}

export const config = {
  // run this middleware for all routes except designed exclusions
  matcher: ["/((?!_next|api|auth|favicon.ico).*)"],
};