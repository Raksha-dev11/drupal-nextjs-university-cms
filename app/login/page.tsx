"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      
      if (data.current_user) {
        // User is already logged in, redirect to appropriate dashboard
        const username = data.current_user.name;
        if (username === "student1") {
          router.replace("/student-dashboard");
        } else if (username === "johnfaculty") {
          router.replace("/faculty-dashboard");
        } else {
          router.replace("/admin-dashboard");
        }
        return;
      }
    } catch (error) {
      // User is not logged in, continue to login page
    } finally {
      setIsCheckingAuth(false);
    }
  }

  async function handleLogin(e: any) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Login failed ❌");
        return;
      }

      const username = data.current_user?.name;

      // Redirect by username
      if (username === "student1") {
        window.location.href = "/student-dashboard";
      } else if (username === "johnfaculty") {
        window.location.href = "/faculty-dashboard";
      } else {
        window.location.href = "/admin-dashboard";
      }
    } catch (err) {
      setMessage("Something went wrong ❌");
    } finally {
      setIsLoading(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full mx-auto p-6 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:bg-white transition-all bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:bg-white transition-all bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          {message && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-pulse">
              <p className="text-center text-red-600 font-medium">{message}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Demo Accounts:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-center gap-2">
                <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full font-medium">Student</span>
                <span className="text-gray-600">student1 / 123456</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">Faculty</span>
                <span className="text-gray-600">johnfaculty / 123456</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Admin</span>
                <span className="text-gray-600">admin / Raksha431@</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
