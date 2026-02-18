import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    console.log('Session cookie found:', sessionCookie);
    
    if (!sessionCookie) {
      console.log('No session cookie found');
      return NextResponse.json({ current_user: null });
    }

    // Parse session data
    let userData;
    try {
      userData = JSON.parse(sessionCookie);
      console.log('Session data parsed:', userData);
    } catch (error) {
      console.error('Error parsing session cookie:', error);
      return NextResponse.json({ current_user: null });
    }

    console.log('Returning user data:', userData);
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ current_user: null });
  }
}

