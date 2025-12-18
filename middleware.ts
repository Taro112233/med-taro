// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all requests without any restrictions
  return NextResponse.next();
}

export const config = {
  matcher: [],
};