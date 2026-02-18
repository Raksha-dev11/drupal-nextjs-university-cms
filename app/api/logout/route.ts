import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create response that clears the session cookie
    const response = NextResponse.json({ message: "Logout successful" });
    
    // Clear the session cookie
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Immediately expire
      path: '/'
    });

    console.log('Session cookie cleared');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
