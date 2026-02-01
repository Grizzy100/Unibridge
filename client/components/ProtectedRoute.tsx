// client/components/ProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, isAuthenticated } from "../lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }

    // Check if user has correct role
    const user = getUser();
    if (!user || !allowedRoles.includes(user.role)) {
      router.push("/admin-login");
    }
  }, [router, allowedRoles]);

  // Show nothing while checking auth
  if (!isAuthenticated()) return null;

  const user = getUser();
  if (!user || !allowedRoles.includes(user.role)) return null;

  // User is authenticated and authorized
  return <>{children}</>;
}
