import { NextRequest, NextResponse } from "next/server";

export async function authMiddleware(req: NextRequest) {
    const {pathname} = req.nextUrl;
    if(pathname.startsWith('/auth')){
        return NextResponse.next();
    }
    const session = req.cookies.get('sessionToken')?.value;
    if(!session){
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|auth|api).*)"],
};  