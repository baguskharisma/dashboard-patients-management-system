// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // List of public routes that don't require authentication
  const publicPaths = ["/login", "/api/login"];

  // If the path is public, allow access
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify the token and extract payload
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    // Define admin-only routes
    const adminOnlyRoutes = ["/settings"];

    // Check if the current route is an admin-only route
    if (
      adminOnlyRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
      )
    ) {
      // Only allow access if the user is an Admin
      if (payload.role !== 1) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/((?!api/login|_next/static|_next/image|favicon.ico).*)"],
};
