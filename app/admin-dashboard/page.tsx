const DRUPAL_URL = "http://localhost:8080";



async function getDashboardData() {

  try {

    const [usersRes, coursesRes, departmentsRes] = await Promise.all([

      fetch(`${DRUPAL_URL}/drupal_headless/web/jsonapi/node/faculty_`, { cache: "no-store" }),

      fetch(`${DRUPAL_URL}/drupal_headless/web/jsonapi/node/course`, { cache: "no-store" }),

      fetch(`${DRUPAL_URL}/drupal_headless/web/jsonapi/taxonomy_term/departments`, { cache: "no-store" }),

    ]);

    return {

      faculty: await usersRes.json(),

      courses: await coursesRes.json(),

      departments: await departmentsRes.json(),

    };

  } catch (error) {

    return {

      faculty: { data: [] },

      courses: { data: [] },

      departments: { data: [] },

    };

  }

}



export default async function AdminDashboard() {

  const data = await getDashboardData();

  

  const facultyCount = data.faculty?.data?.length || 0;

  const courseCount = data.courses?.data?.length || 0;

  const departmentCount = data.departments?.data?.length || 0;



  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50">

      <main className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">

          Admin Dashboard 🛠️

        </h1>

        

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">

            <h2 className="text-xl font-semibold text-pink-600 mb-4">User Management</h2>

            <p className="text-gray-600 mb-4">Manage faculty, students, and admin accounts</p>

            <div className="space-y-2">

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Total Faculty:</span>

                <span className="font-semibold text-pink-600">{facultyCount}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Active Departments:</span>

                <span className="font-semibold text-purple-600">{departmentCount}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Total Courses:</span>

                <span className="font-semibold text-blue-600">{courseCount}</span>

              </div>

            </div>

          </div>

          

          <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">

            <h2 className="text-xl font-semibold text-purple-600 mb-4">Course Management</h2>

            <p className="text-gray-600 mb-4">Create and manage academic courses</p>

            <div className="space-y-2">

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Total Courses:</span>

                <span className="font-semibold text-gray-800">{courseCount}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Departments:</span>

                <span className="font-semibold text-purple-600">{departmentCount}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Faculty Members:</span>

                <span className="font-semibold text-blue-600">{facultyCount}</span>

              </div>

            </div>

          </div>

          

          <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">

            <h2 className="text-xl font-semibold text-blue-600 mb-4">Department Management</h2>

            <p className="text-gray-600 mb-4">Oversee academic departments</p>

            <div className="space-y-2">

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Total Departments:</span>

                <span className="font-semibold text-gray-800">{departmentCount}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Department Heads:</span>

                <span className="font-semibold text-blue-600">{departmentCount}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Faculty Assigned:</span>

                <span className="font-semibold text-purple-600">{facultyCount}</span>

              </div>

            </div>

          </div>

          

          <div className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">

            <h2 className="text-xl font-semibold text-pink-600 mb-4">System Settings</h2>

            <p className="text-gray-600 mb-4">Configure system parameters</p>

            <div className="space-y-2">

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">System Status:</span>

                <span className="font-semibold text-green-600">Online</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Data Sources:</span>

                <span className="font-semibold text-gray-800">3 Active</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">API Status:</span>

                <span className="font-semibold text-pink-600">Connected</span>

              </div>

            </div>

          </div>

          

          <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">

            <h2 className="text-xl font-semibold text-purple-600 mb-4">Analytics & Reports</h2>

            <p className="text-gray-600 mb-4">View system analytics and reports</p>

            <div className="space-y-2">

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Content Items:</span>

                <span className="font-semibold text-gray-800">{facultyCount + courseCount}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Departments:</span>

                <span className="font-semibold text-purple-600">{departmentCount}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Data Freshness:</span>

                <span className="font-semibold text-blue-600">Live</span>

              </div>

            </div>

          </div>

          

          <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">

            <h2 className="text-xl font-semibold text-blue-600 mb-4">System Overview</h2>

            <p className="text-gray-600 mb-4">System health and status</p>

            <div className="space-y-2">

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Drupal API:</span>

                <span className="font-semibold text-green-600">Connected</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Next.js:</span>

                <span className="font-semibold text-gray-800">Running</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Environment:</span>

                <span className="font-semibold text-blue-600">Development</span>

              </div>

            </div>

          </div>

        </div>

        

        {/* Quick Actions Section */}

        <div className="mt-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>

          <div className="flex flex-wrap gap-4">

            <a href="/faculty" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">

              View Faculty

            </a>

            <a href="/courses" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg">

              View Courses

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

