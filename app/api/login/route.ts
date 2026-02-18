import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, pass } = await req.json();
    console.log('Login attempt with body:', { name, pass });
    
    // Check if Drupal is running first
    try {
      const healthCheck = await fetch("http://localhost:8080/drupal_headless/web/jsonapi/node/faculty_", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log('Drupal API health check status:', healthCheck.status);
      
      if (!healthCheck.ok) {
        console.error('Drupal API is not responding. Please check if Drupal is running on port 8080');
        return NextResponse.json(
          { error: "Drupal API is not available. Please check if Drupal is running on localhost:8080" },
          { status: 503 }
        );
      }
    } catch (error) {
      console.error('Drupal health check failed:', error);
    }
    
    console.log('Calling Drupal login API at: http://localhost:8080/drupal_headless/web/user/login?_format=json');
    
    const res = await fetch(
      "http://localhost:8080/drupal_headless/web/user/login?_format=json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, pass }),
        credentials: "include",
      }
    );

    const data = await res.json();
    console.log('Drupal login response status:', res.status);
    console.log('Drupal login response:', data);

    if (!res.ok || !data.current_user) {
      console.log('Login failed - no current_user in response');
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Extract user role from the login response
    const userRoles = data.current_user.roles || [];
    const username = data.current_user.name || '';
    console.log('User roles from Drupal:', userRoles);
    console.log('Username from Drupal:', username);
    
    // Determine user role based on username or roles
    let userRole = 'student'; // default
    if (username.includes('admin') || userRoles.includes('administrator')) {
      userRole = 'administrator';
    } else if (username.includes('faculty') || userRoles.includes('faculty')) {
      userRole = 'faculty';
    } else if (username.includes('student') || userRoles.includes('student')) {
      userRole = 'student';
    }
    
    console.log('Determined user role:', userRole);

    // Create session data
    const sessionData = {
      current_user: data.current_user,
      role: userRole,
      loginTime: new Date().toISOString()
    };
    
    console.log('Session data to set:', sessionData);

    // Set session cookie
    const response = NextResponse.json({
      current_user: data.current_user,
      csrf_token: data.csrf_token,
      logout_token: data.logout_token,
      role: userRole
    });

    // Set session cookie that WithAuth can read
    response.cookies.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    console.log('Session cookie set successfully');
    return response;
  } catch (error) {
    console.error('Login API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: "Login failed: " + errorMessage },
      { status: 500 }
    );
  }
}

