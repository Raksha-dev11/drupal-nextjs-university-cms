"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  allowedRoles: string[];
  children: ReactNode;
}

export default function WithAuth({ allowedRoles, children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        console.log('WithAuth session data:', data);

        if (!data.current_user) {
          console.log('WithAuth: No current_user found, redirecting to login');
          router.push("/login"); // not logged in
          return;
        }

        // Check role from session data (set by login API) or fallback to Drupal roles
        const userRole = data.role || 'student'; // Use role from session data
        const hasAccess = allowedRoles.includes(userRole);
        console.log('WithAuth: User role:', userRole, 'Allowed roles:', allowedRoles, 'Has access:', hasAccess);

        if (!hasAccess) {
          console.log('WithAuth: Role not in allowed list, redirecting to login');
          router.push("/login"); // logged in but wrong role
        }
      } catch (err) {
        console.error('WithAuth error:', err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Checking access...</p>;

  return <>{children}</>;
}
