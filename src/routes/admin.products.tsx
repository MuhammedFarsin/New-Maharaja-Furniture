import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products")({
  component: () => <Outlet />,
});

export { Link };
