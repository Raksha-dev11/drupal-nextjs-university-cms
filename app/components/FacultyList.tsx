"use client";

import Link from "next/link";
import { useState } from "react";

const DRUPAL_URL = "http://localhost:8080";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function FacultyList({ data }: any) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");


  // Get unique departments
  const departments = Array.from(
    new Set(
      data.data.map((item: any) => {
        const deptId =
          item.relationships.field_department.data?.id;

        const dept = data.included.find(
          (inc: any) =>
            inc.type === "taxonomy_term--departments" &&
            inc.id === deptId
        );

        return dept?.attributes?.name || "No Department";
      })
    )
  );

  // Filter faculty
const filteredFaculty = data.data.filter((item: any) => {
  const deptId =
    item.relationships.field_department.data?.id;

  const dept = data.included.find(
    (inc: any) =>
      inc.type === "taxonomy_term--departments" &&
      inc.id === deptId
  );

  const deptName = dept?.attributes?.name || "No Department";

  // Department filter
  const matchesDept =
    selectedDept === "All" || deptName === selectedDept;

  // Search filter
  const matchesSearch =
    item.attributes.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  return matchesDept && matchesSearch;
});


  return (
    <main className="w-full p-6 bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Our Faculty
          </h1>
          
          <Link href="/courses" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:scale-105 transition-all shadow-md font-medium">
            View All Courses
          </Link>
        </div>

        <div className="flex flex-col items-center mb-8">
          <input
            type="text"
            placeholder="Search faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-4 border-2 border-pink-200 rounded-xl bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:bg-white focus:shadow-lg transition-all"
          />
        </div>


      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-8 flex-wrap justify-center">
        <button
          onClick={() => setSelectedDept("All")}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
            selectedDept === "All"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-pink-50 border border-pink-200"
          }`}
        >
          All
        </button>

        {departments.map((dept: any) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              selectedDept === dept
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-pink-50 border border-pink-200"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* FACULTY GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFaculty.map((item: any) => {
          const photoId =
            item.relationships.field_photo.data?.id;

          const file = data.included.find(
            (inc: any) =>
              inc.type === "file--file" &&
              inc.id === photoId
          );

          const imageUrl = file?.attributes?.uri?.url
            ? `${DRUPAL_URL}${file.attributes.uri.url}`
            : null;

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

                <p className="text-sm text-pink-500 font-medium">
                  View Profile →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      </div>
    </main>
  );
}
