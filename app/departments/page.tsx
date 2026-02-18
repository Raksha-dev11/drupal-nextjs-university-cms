"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DRUPAL_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "http://localhost:8080/drupal_headless/web";

// Use proxy in production, direct URL in development
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api/proxy/drupal'
  : DRUPAL_URL;

function createSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

async function getDepartments() {
  const res = await fetch(
    `${API_BASE}/jsonapi/taxonomy_term/departments`,
    { cache: "no-store" }
  );

  return res.json();
}

export default function DepartmentsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('=== Environment Debug ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DRUPAL_URL:', DRUPAL_URL);
    console.log('API_BASE:', API_BASE);

    async function loadData() {
      try {
        const departmentsData = await getDepartments();
        setData(departmentsData);
      } catch (error) {
        console.error("Error loading departments data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading departments...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load departments data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50">
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Academic Departments 🏢
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map((dept: any) => (
            <Link
              key={dept.id}
              href={`/departments/${createSlug(dept.attributes.name)}`}
              className="block bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all group"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {dept.attributes.name.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold text-pink-600 group-hover:text-pink-700 transition-colors">
                  {dept.attributes.name}
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Explore programs, faculty, and courses in the {dept.attributes.name} department.
              </p>
              <div className="flex items-center text-pink-600 font-semibold group-hover:text-pink-700 transition-colors">
                <span>View Department</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        
        {data.data?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Departments Found</h3>
            <p className="text-gray-500">Check back later for department information.</p>
          </div>
        )}
      </main>
    </div>
  );
}
