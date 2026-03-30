// client/components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, isAuthenticated } from "../lib/auth";
import type { Role } from "../lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
  replace?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
  replace = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const navigate = (path: string) => {
    if (replace) {
      router.replace(path);
      return;
    }
    router.push(path);
  };

  useEffect(() => {
    setIsHydrated(true);

    // Check if user is logged in
    if (!isAuthenticated()) {
      setIsAuthorized(false);
      navigate(redirectTo);
      return;
    }

    // Check if user has correct role
    const user = getUser();
    if (!user || !allowedRoles.includes(user.role)) {
      setIsAuthorized(false);
      navigate(redirectTo);
      return;
    }

    setIsAuthorized(true);
  }, [allowedRoles, redirectTo, replace, router]);

  // Render a stable shell until hydration/auth checks complete.
  if (!isHydrated || !isAuthorized) return null;

  // User is authenticated and authorized
  return <>{children}</>;
}
