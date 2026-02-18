const DRUPAL_URL = "http://localhost:8080";

function createSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

async function getData() {
  const [deptsRes, facultyRes, coursesRes] =
    await Promise.all([
      fetch(
        `${DRUPAL_URL}/drupal_headless/web/jsonapi/taxonomy_term/departments`
      ),
      fetch(
        `${DRUPAL_URL}/drupal_headless/web/jsonapi/node/faculty_?include=field_department`
      ),
      fetch(
        `${DRUPAL_URL}/drupal_headless/web/jsonapi/node/course?include=field_departments`
      ),
    ]);

  return {
    departments: await deptsRes.json(),
    faculty: await facultyRes.json(),
    courses: await coursesRes.json(),
  };
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { departments, faculty, courses } =
    await getData();

  const dept = departments.data.find(
    (d: any) =>
      createSlug(d.attributes.name) === slug
  );

  if (!dept) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Department Not Found</h1>
          <p className="text-gray-500 mb-6">The department you're looking for doesn't exist.</p>
          <a href="/departments" className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">
            Back to Departments
          </a>
        </div>
      </div>
    );
  }

  const deptId = dept.id;

  // ===== FILTER FACULTY =====
  const facultyList = faculty.data.filter(
    (f: any) =>
      f.relationships.field_department.data?.id === deptId
  );

  // ===== FILTER COURSES =====
  const courseList = courses.data.filter(
    (c: any) =>
      c.relationships.field_departments.data?.id ===
      deptId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50">
      <main className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <a href="/departments" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Departments
          </a>
          
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-6">
              {dept.attributes.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {dept.attributes.name}
              </h1>
              <p className="text-gray-600 text-lg">
                Academic Department Overview
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Faculty Members</p>
                <p className="text-3xl font-bold text-pink-600">{facultyList.length}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Courses Offered</p>
                <p className="text-3xl font-bold text-purple-600">{courseList.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Department Status</p>
                <p className="text-3xl font-bold text-blue-600">Active</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Faculty Section */}
          <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Faculty Members
            </h2>
            
            {facultyList.length > 0 ? (
              <div className="space-y-3">
                {facultyList.map((f: any) => (
                  <div key={f.id} className="flex items-center p-3 bg-pink-50/50 rounded-lg hover:bg-pink-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {f.attributes.title.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{f.attributes.title}</p>
                      <p className="text-sm text-gray-600">Faculty Member</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-500">No faculty members assigned to this department</p>
              </div>
            )}
          </div>

          {/* Courses Section */}
          <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-purple-600 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Courses Offered
            </h2>
            
            {courseList.length > 0 ? (
              <div className="space-y-3">
                {courseList.map((c: any) => (
                  <div key={c.id} className="flex items-center p-3 bg-purple-50/50 rounded-lg hover:bg-purple-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {c.attributes.title.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{c.attributes.title}</p>
                      <p className="text-sm text-gray-600">
                        {c.attributes.field_course_code} • {c.attributes.field_credits} credits
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-gray-500">No courses offered by this department</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
