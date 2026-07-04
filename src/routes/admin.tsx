import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminAuth } from "@/lib/use-admin-auth";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const isLoginRoute = pathname === "/admin/login";
  const auth = useAdminAuth();

  useEffect(() => {
    if (auth.loading) return;
    if (pathname === "/admin") {
      router.navigate({ to: auth.isAdmin ? "/admin/dashboard" : "/admin/login", replace: true });
      return;
    }
    if (!isLoginRoute && (!auth.userId || !auth.isAdmin)) {
      router.navigate({ to: "/admin/login", replace: true });
    }
    if (isLoginRoute && auth.userId && auth.isAdmin) {
      router.navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [auth.loading, auth.userId, auth.isAdmin, pathname, isLoginRoute, router]);

  if (isLoginRoute) return <Outlet />;
  if (auth.loading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  if (!auth.isAdmin) return null;

  return (
    <AdminShell email={auth.email}>
      <Outlet />
    </AdminShell>
  );
}
