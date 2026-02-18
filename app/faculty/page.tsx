"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DRUPAL_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "http://localhost:8080/drupal_headless/web";

async function getFacultyData() {
  try {
    const [facultyRes, departmentsRes] = await Promise.all([
      fetch(`${DRUPAL_URL}/jsonapi/node/faculty_`, { cache: "no-store" }),
      fetch(`${DRUPAL_URL}/jsonapi/taxonomy_term/departments`, { cache: "no-store" }),
    ]);

    const facultyData = await facultyRes.json();
    const departmentsData = await departmentsRes.json();

    return {
      faculty: facultyData,
      departments: departmentsData,
    };
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    return { faculty: { data: [] }, departments: { data: [] } };
  }
}

function createSlug(name: string) {
  if (!name) return "unknown";
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default async function FacultyPage() {
  const data = await getFacultyData();

  // Get unique departments
  const departments = Array.from(
    new Set(
      data.faculty.data.map((item: any) => {
        const deptId = item.relationships.field_department?.data?.id;
        const dept = data.departments.included?.find(
          (inc: any) =>
            inc.type === "taxonomy_term--departments" && inc.id === deptId
        );
        return dept?.attributes?.name || "No Department";
      })
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50">
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Faculty Directory 👥
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.faculty.data.map((item: any) => {
            const photoId = item.relationships.field_photo?.data?.id;
            const file = data.faculty.included?.find(
              (inc: any) => inc.type === "file--file" && inc.id === photoId
            );
            const imageUrl = file?.attributes?.uri?.url
              ? `${DRUPAL_URL}${file.attributes.uri.url}`
              : null;

            const deptId = item.relationships.field_department?.data?.id;
            const dept = data.departments.included?.find(
              (inc: any) =>
                inc.type === "taxonomy_term--departments" && inc.id === deptId
            );
            const departmentName = dept?.attributes?.name || "No Department";

            return (
              <Link
                key={item.id}
                href={`/faculty/${createSlug(item.attributes.title)}`}
                className="border-2 border-pink-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white hover:border-pink-400"
              >
                {imageUrl && (
                  <div className="h-56 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                    <img
                      src={imageUrl}
                      alt={item.attributes.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6 bg-white">
                  <h2 className="text-xl font-semibold mb-3 text-gray-800 hover:text-pink-600 transition-colors">
                    {item.attributes.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-2">
                    {item.attributes.field_designation}
                  </p>

                  <p className="text-sm text-pink-500 font-medium mb-2">
                    {departmentName}
                  </p>

                  <p className="text-sm text-pink-600 font-medium">
                    View Profile →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {data.faculty.data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No faculty members available at this time.</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">
              Back to Home
            </a>
            <a href="/courses" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">
              Browse Courses
            </a>
            <a href="/departments" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">
              View Departments
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
