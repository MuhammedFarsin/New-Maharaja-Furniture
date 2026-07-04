import { useState } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Tags,
  FolderOpen,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { adminSignOut } from "@/lib/use-admin-auth";

const navLinks = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    to: "/admin/categories",
    label: "Categories",
    icon: Tags,
  },
  {
    to: "/admin/collections",
    label: "Collections",
    icon: FolderOpen,
  },
] as const;

export function AdminShell({ children, email }: { children: ReactNode; email: string | null }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await adminSignOut();
    router.navigate({ to: "/admin/login" });
  }

  // Extracted navigation links to keep the code DRY
  const NavigationItems = () => (
    <>
      {navLinks.map((link) => {
        const active = pathname.startsWith(link.to);
        const Icon = link.icon;
        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" /> {link.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                M
              </span>
              <div className="hidden sm:block leading-tight">
                <strong className="block text-sm font-bold tracking-[0.08em] text-primary">
                  MAHARAJA
                </strong>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
                  ADMIN
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" asChild className="hidden xs:flex">
              <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Visit Site</span>
              </a>
            </Button>
            {email && (
              <span className="hidden md:inline text-xs text-muted-foreground max-w-150px truncate">
                {email}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout} className="h-9 px-3">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Slide-out Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Content */}
          <aside className="fixed inset-y-0 left-0 w-full max-w-xs bg-background p-6 shadow-lg border-r border-border flex flex-col gap-6 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between">
              <div className="leading-tight">
                <strong className="block text-sm font-bold tracking-[0.08em] text-primary">
                  MAHARAJA
                </strong>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
                  ADMIN
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {email && (
              <div className="text-xs text-muted-foreground px-3">Logged in as: {email}</div>
            )}
            <nav className="grid gap-1">
              <NavigationItems />
            </nav>
          </aside>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="mx-auto grid max-w-7xl gap-6 p-4 sm:p-6 lg:grid-cols-[240px_1fr] lg:px-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <nav className="grid gap-1 rounded-xl bg-background p-2 shadow-sm border border-border">
            <NavigationItems />
          </nav>
        </aside>

        {/* Content Viewport */}
        <main className="min-w-0 w-full overflow-hidden rounded-xl">{children}</main>
      </div>
    </div>
  );
}
