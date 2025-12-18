// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' },
        { status: 400 }
      );
    }

    // Validate against environment password
    if (password !== process.env.SYSTEM_PASSWORD) {
      return NextResponse.json(
        { error: 'รหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Create auth cookie data
    const authData = {
      username: username.trim(),
      authenticated: true,
      timestamp: Date.now(),
    };

    console.log('Setting auth cookie with data:', authData); // Debug log

    // Create response with success
    const response = NextResponse.json({ 
      success: true,
      username: username.trim()
    });

    // Set cookie (NOT httpOnly so client can read username)
    response.cookies.set('auth', JSON.stringify(authData), {
      httpOnly: false, // ✅ เปลี่ยนเป็น false เพื่อให้ client-side อ่านได้
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    console.log('Cookie set successfully'); // Debug log

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}