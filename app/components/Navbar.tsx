"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const linkClass = (path: string) =>
    pathname === path
      ? "text-pink-600 font-semibold"
      : "text-gray-700 hover:text-pink-600 transition";

  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  async function checkAuthStatus() {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      if (data.current_user) {
        setIsLoggedIn(true);
        setUserName(data.current_user.name);
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserName("");
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
      setIsLoggedIn(false);
      setUserName("");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="w-full bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          🎓 University CMS
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8">
          <Link href="/" className={linkClass("/")}>
            Faculty
          </Link>

          <Link href="/courses" className={linkClass("/courses")}>
            Courses
          </Link>

          <Link
            href="/departments"
            className={linkClass("/departments")}
          >
            Departments
          </Link>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:scale-105 transition-all shadow-md"
              >
                <span className="text-sm font-medium">{userName}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-pink-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-200">
                    <p className="text-sm font-medium text-gray-800">Welcome back!</p>
                    <p className="text-xs text-gray-600">{userName}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-pink-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:scale-105 transition-all shadow-md font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden px-6 pb-4">
        <div className="flex gap-6">
          <Link href="/" className={linkClass("/")}>
            Faculty
          </Link>
          <Link href="/courses" className={linkClass("/courses")}>
            Courses
          </Link>
          <Link href="/departments" className={linkClass("/departments")}>
            Departments
          </Link>
        </div>
      </div>
    </nav>
  );
}
