import WithAuth from "@/utils/withAuth";
import StudentDashboardContent from "./StudentDashboardContent";

export default function StudentDashboardPage() {
  return (
    <WithAuth allowedRoles={["student"]}>
      <StudentDashboardContent />
    </WithAuth>
  );
}
