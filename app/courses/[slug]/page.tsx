const DRUPAL_URL = "http://localhost:8080";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function getCourseBySlug(slug: string) {
  const res = await fetch(
    `${DRUPAL_URL}/drupal_headless/web/jsonapi/node/course?include=field_faculty,field_departments`,
    { cache: "no-store" }
  );

  const json = await res.json();

  const course = json.data.find(
    (item: any) =>
      createSlug(item.attributes.title) === slug
  );

  return {
    course,
    included: json.included || [],
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { course, included } =
    await getCourseBySlug(slug);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Course Not Found</h1>
          <p className="text-gray-500 mb-6">The course you're looking for doesn't exist.</p>
          <a href="/courses" className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">
            Back to Courses
          </a>
        </div>
      </div>
    );
  }

  // ===== FACULTY =====
  const facultyId =
    course.relationships.field_faculty.data?.id;

  const faculty = included.find(
    (inc: any) =>
      inc.type === "node--faculty_" &&
      inc.id === facultyId
  );

  // ===== DEPARTMENT =====
  const deptId =
    course.relationships.field_departments.data?.id;

  const dept = included.find(
    (inc: any) =>
      inc.type === "taxonomy_term--departments" &&
      inc.id === deptId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50">
      <main className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <a href="/courses" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </a>
          
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-6">
              {course.attributes.title.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {course.attributes.title}
              </h1>
              <p className="text-gray-600 text-lg">
                {course.attributes.field_course_code} • {course.attributes.field_credits} credits
              </p>
            </div>
          </div>
        </div>

        {/* Course Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Course Code</p>
                <p className="text-2xl font-bold text-pink-600">{course.attributes.field_course_code}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Credits</p>
                <p className="text-2xl font-bold text-purple-600">{course.attributes.field_credits}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
          
          {dept && (
            <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Department</p>
                  <p className="text-lg font-bold text-blue-600">{dept.attributes?.name}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          
          {faculty && (
            <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Instructor</p>
                  <p className="text-lg font-bold text-pink-600">{faculty.attributes?.title}</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Course Description */}
        {course.attributes.field_description && (
          <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-purple-600 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Course Description
            </h2>
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: course.attributes.field_description,
              }}
            />
          </div>
        )}

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Course Details */}
          <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Course Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-pink-50/50 rounded-lg">
                <span className="text-gray-600">Course Title</span>
                <span className="font-semibold text-gray-800">{course.attributes.title}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-pink-50/50 rounded-lg">
                <span className="text-gray-600">Course Code</span>
                <span className="font-semibold text-pink-600">{course.attributes.field_course_code}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-pink-50/50 rounded-lg">
                <span className="text-gray-600">Credit Hours</span>
                <span className="font-semibold text-purple-600">{course.attributes.field_credits}</span>
              </div>
              
              {dept && (
                <div className="flex justify-between items-center p-3 bg-pink-50/50 rounded-lg">
                  <span className="text-gray-600">Department</span>
                  <span className="font-semibold text-blue-600">{dept.attributes?.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Instructor Information */}
          {faculty && (
            <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Instructor Information
              </h2>
              
              <div className="flex items-center p-4 bg-blue-50/50 rounded-lg mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {faculty.attributes.title.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{faculty.attributes.title}</p>
                  <p className="text-sm text-gray-600">Course Instructor</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Contact instructor for course information</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Office hours available upon request</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="/courses" className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">
            Back to Courses
          </a>
          {dept && (
            <a href={`/departments/${createSlug(dept.attributes?.name)}`} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">
              View Department
            </a>
          )}
          <button className="px-8 py-4 border-2 border-pink-300 text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition-all">
            Enroll Now
          </button>
        </div>
      </main>
    </div>
  );
}
