import Link from "next/link";

const DRUPAL_URL = "http://localhost:8080";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function getCourses() {
  const res = await fetch(
    `${DRUPAL_URL}/drupal_headless/web/jsonapi/node/course?include=field_faculty,field_departments`,
    { cache: "no-store" }
  );

  return res.json();
}

export default async function CoursesPage() {
  const data = await getCourses();

  return (
    <main className="w-full p-6 bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Courses
          </h1>
          
          <Link href="/" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:scale-105 transition-all shadow-md font-medium">
            ← Back to Faculty
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.data?.map((course: any) => {
          // ===== FACULTY =====
          const facultyId =
            course.relationships.field_faculty.data?.id;

          const faculty = data.included?.find(
            (inc: any) =>
              inc.type === "node--faculty_" &&
              inc.id === facultyId
          );

          // ===== DEPARTMENT =====
          const deptId =
            course.relationships.field_departments.data?.id;

          const dept = data.included?.find(
            (inc: any) =>
              inc.type === "taxonomy_term--departments" &&
              inc.id === deptId
          );

          return (
            <Link
              key={course.id}
              href={`/courses/${createSlug(course.attributes.title)}`}
              className="border-2 border-pink-200 rounded-xl p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all bg-white hover:border-pink-400 block"
            >
              <h2 className="text-xl font-semibold mb-2 text-pink-600">
                {course.attributes.title}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                Code: {course.attributes.field_course_code}
              </p>

              <p className="text-sm text-gray-600 mb-1">
                Credits: {course.attributes.field_credits}
              </p>

              <p className="text-sm text-gray-500 mb-1">
                Department: {dept?.attributes?.name}
              </p>

              <p className="text-sm text-blue-600 mt-1">
                Faculty: {faculty?.attributes?.title}
              </p>

              <p className="text-xs text-pink-500 mt-2">
                View Details →
              </p>
            </Link>
          );
        })}
        </div>
      </div>
    </main>
  );
}
