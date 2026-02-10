import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";
import { NeonSpinner } from "@/components/ui/neon-spinner";

/**
 * Wraps all /admin/* routes. Ensures only admins can access;
 * redirects others to dashboard. Renders <Outlet /> for admin children.
 */
export function AdminLayout() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin(user?.id);

  if (authLoading || adminLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <NeonSpinner size="lg" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
