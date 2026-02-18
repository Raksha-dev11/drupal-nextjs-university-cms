import Link from "next/link";

const DRUPAL_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "http://localhost:8080/drupal_headless/web";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function getCourses() {
  try {
    const res = await fetch(
      `${DRUPAL_URL}/jsonapi/node/course`,
      { cache: "no-store" }
    );
    
    if (!res.ok) {
      console.error('Failed to fetch courses:', res.status, res.statusText);
      return { data: [] };
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { data: [] };
  }
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

        {!data?.data || data.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses available at this time.</p>
            <p className="text-gray-400 text-sm mt-2">Please check back later or contact administrator.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((course: any) => {
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
                    Code: {course.attributes.field_course_code || 'N/A'}
                  </p>

                  <p className="text-sm text-gray-600 mb-1">
                    Credits: {course.attributes.field_credits || 'N/A'}
                  </p>

                  <p className="text-xs text-pink-500 mt-2">
                    View Details →
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
