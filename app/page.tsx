"use client";

import { useState, useEffect } from "react";
import FacultyList from "./components/FacultyList";

const DRUPAL_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "http://localhost:8080/drupal_headless/web";

async function getFaculty() {
  const res = await fetch(
    `${DRUPAL_URL}/jsonapi/node/faculty_?include=field_photo,field_department`,
    { cache: "no-store" }
  );

  return res.json();
}

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const facultyData = await getFaculty();
        setData(facultyData);
      } catch (error) {
        console.error("Error loading faculty data:", error);
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
          <p className="text-gray-600">Loading faculty directory...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load faculty data.</p>
        </div>
      </div>
    );
  }

  return <FacultyList data={data} />;
}
