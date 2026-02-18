import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, pass } = await req.json();
    console.log('Test login attempt with body:', { name, pass });
    
    // Mock user validation
    let userData = null;
    
    if (name === "student1" && pass === "123456") {
      userData = {
        current_user: {
          uid: "1",
          name: "student1",
          mail: "student1@university.edu",
          roles: ["student"]
        }
      };
    } else if (name === "johnfaculty" && pass === "123456") {
      userData = {
        current_user: {
          uid: "2", 
          name: "johnfaculty",
          mail: "johnfaculty@university.edu",
          roles: ["faculty"]
        }
      };
    } else if (name === "admin" && pass === "Raksha431@") {
      userData = {
        current_user: {
          uid: "3",
          name: "admin", 
          mail: "admin@university.edu",
          roles: ["administrator"]
        }
      };
    }

    if (!userData) {
      console.log('Invalid credentials');
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log('Test login successful for:', userData.current_user.name);

    // Create session data
    const sessionData = {
      current_user: userData.current_user,
      loginTime: new Date().toISOString()
    };
    
    console.log('Test session data to set:', sessionData);

    // Set session cookie
    const response = NextResponse.json(userData);

    // Set session cookie that WithAuth can read
    response.cookies.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    console.log('Test session cookie set successfully');
    return response;
  } catch (error) {
    console.error('Test login API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: "Test login failed: " + errorMessage },
      { status: 500 }
    );
  }
}
