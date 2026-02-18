"use client";

import { useState, useEffect } from "react";

const DRUPAL_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "http://localhost:8080/drupal_headless/web";

async function getFacultyData() {
  try {
    const [coursesRes, facultyRes, departmentsRes] = await Promise.all([
      fetch(`${DRUPAL_URL}/jsonapi/node/course`, { cache: "no-store" }),
      fetch(`${DRUPAL_URL}/jsonapi/node/faculty_`, { cache: "no-store" }),
      fetch(`${DRUPAL_URL}/jsonapi/taxonomy_term/departments`, { cache: "no-store" }),
    ]);

    return {
      courses: await coursesRes.json(),
      faculty: await facultyRes.json(),
      departments: await departmentsRes.json(),
    };
  } catch (error) {
    return {
      courses: { data: [] },
      faculty: { data: [] },
      departments: { data: [] },
    };
  }
}

export default async function FacultyDashboardContent() {
  const data = await getFacultyData();
  
  const courseCount = data.courses?.data?.length || 0;
  const facultyCount = data.faculty?.data?.length || 0;
  const departmentCount = data.departments?.data?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50">
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Faculty Dashboard 👨‍🏫
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-pink-600 mb-4">Course Catalog</h2>
            <p className="text-gray-600 mb-4">Browse available courses and teaching materials</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Courses:</span>
                <span className="font-semibold text-pink-600">{courseCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Faculty Members:</span>
                <span className="font-semibold text-purple-600">{facultyCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Departments:</span>
                <span className="font-semibold text-blue-600">{departmentCount}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-purple-600 mb-4">Faculty Directory</h2>
            <p className="text-gray-600 mb-4">Connect with faculty members and staff</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Faculty:</span>
                <span className="font-semibold text-gray-800">{facultyCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Departments:</span>
                <span className="font-semibold text-purple-600">{departmentCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Courses Offered:</span>
                <span className="font-semibold text-blue-600">{courseCount}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Department Overview</h2>
            <p className="text-gray-600 mb-4">Academic department information</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Departments:</span>
                <span className="font-semibold text-gray-800">{departmentCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Faculty Members:</span>
                <span className="font-semibold text-blue-600">{facultyCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Courses Available:</span>
                <span className="font-semibold text-purple-600">{courseCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Activity */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Academic Content</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-pink-600 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Course Catalog
              </h3>
              
              <div className="space-y-3">
                {data.courses?.data?.slice(0, 3).map((course: any) => (
                  <div key={course.id} className="flex items-center p-3 bg-pink-50/50 rounded-lg hover:bg-pink-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {course.attributes.title.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{course.attributes.title}</p>
                      <p className="text-sm text-gray-600">{course.attributes.field_course_code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-pink-600">{course.attributes.field_credits} credits</p>
                      <p className="text-xs text-gray-500">Available</p>
                    </div>
                  </div>
                ))}
                
                {(!data.courses?.data || data.courses.data.length === 0) && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No courses available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Faculty Directory
              </h3>
              
              <div className="space-y-3">
                {data.faculty?.data?.slice(0, 3).map((faculty: any) => (
                  <div key={faculty.id} className="flex items-center p-3 bg-purple-50/50 rounded-lg hover:bg-purple-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {faculty.attributes.title.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{faculty.attributes.title}</p>
                      <p className="text-sm text-gray-600">Faculty Member</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-purple-600">Available</p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                  </div>
                ))}
                
                {(!data.faculty?.data || data.faculty.data.length === 0) && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No faculty members available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <a href="/courses" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">
              Browse Courses
            </a>
            <a href="/faculty" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">
              View Faculty
            </a>
            <a href="/departments" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">
              View Departments
            </a>
            <a href="/" className="px-6 py-3 border-2 border-pink-300 text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition-all">
              Back to Home
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
