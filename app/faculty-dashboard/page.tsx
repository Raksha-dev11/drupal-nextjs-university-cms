import WithAuth from "@/utils/withAuth";
import FacultyDashboardContent from "./FacultyDashboardContent";

export default function FacultyDashboardPage() {
  return (
    <WithAuth allowedRoles={["faculty"]}>
      <FacultyDashboardContent />
    </WithAuth>
  );
}
