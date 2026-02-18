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
    `http://localhost:8080/drupal_headless/web/jsonapi/node/course?include=field_faculty`,
    { cache: "no-store" }
  );

  return res.json();
}

async function getFacultyBySlug(slug: string) {
  const res = await fetch(
    `${DRUPAL_URL}/drupal_headless/web/jsonapi/node/faculty_?include=field_photo`,
    { cache: "no-store" }
  );

  const json = await res.json();

  const faculty = json.data.find(
    (item: any) =>
      createSlug(item.attributes.title) === slug
  );

  return { faculty, included: json.included || [] };
}

export default async function FacultyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { faculty, included } =
    await getFacultyBySlug(slug);

  const coursesData = await getCourses();

  if (!faculty) {
    return <div>Faculty not found</div>;
  }

  const photoId =
    faculty.relationships.field_photo.data?.id;

  const file = included.find(
    (item: any) =>
      item.type === "file--file" &&
      item.id === photoId
  );

  const imageUrl = file?.attributes?.uri?.url
    ? `${DRUPAL_URL}${file.attributes.uri.url}`
    : null;

  const facultyCourses = coursesData.data.filter(
    (course: any) => {
      const facultyData = course.relationships?.field_faculty?.data;
      if (!facultyData) return false;
      
      const facultyArray = Array.isArray(facultyData) ? facultyData : [facultyData];
      return facultyArray.some((f: any) => f.id === faculty.id);
    }
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        <Link 
          href="/" 
          className="inline-flex items-center mb-8 text-pink-600 hover:text-pink-700 font-medium"
        >
          ← Back to Faculty Directory
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Image */}
          <div className="space-y-6">
            {imageUrl ? (
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-pink-200">
                <img
                  src={imageUrl}
                  alt={faculty.attributes.title}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 to-transparent pointer-events-none"></div>
              </div>
            ) : (
              <div className="h-96 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-pink-300">
                <span className="text-white text-2xl font-semibold">No Image Available</span>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {faculty.attributes.title}
              </h1>
              
              <div className="space-y-4">
                {faculty.attributes.field_designation && (
                  <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-pink-600 mb-2">Designation</h3>
                    <p className="text-xl text-gray-800">{faculty.attributes.field_designation}</p>
                  </div>
                )}
                
                {faculty.attributes.field_department && (
                  <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-purple-600 mb-2">Department</h3>
                    <p className="text-xl text-gray-800">{faculty.attributes.field_department}</p>
                  </div>
                )}
              </div>
            </div>

            {faculty.attributes.field_bio?.processed && (
              <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-pink-600">Biography</h2>
                <div 
                  className="prose max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: faculty.attributes.field_bio.processed,
                  }}
                />
              </div>
            )}

            {/* Courses Section */}
            <div style={{ marginTop: "30px" }}>
              <h2 className="text-2xl font-bold mb-3 text-pink-600">
                Courses Taught
              </h2>

              {facultyCourses.length > 0 ? (
                <ul className="list-disc pl-6 space-y-2">
                  {facultyCourses.map((course: any) => (
                    <li key={course.id} className="text-gray-700">
                      {course.attributes.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No courses assigned.</p>
              )}
            </div>

            <div className="flex gap-4">
              <Link 
                href="/" 
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
              >
                Back to Directory
              </Link>
              <button className="px-8 py-4 border-2 border-pink-300 text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition-all">
                Contact Faculty
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
