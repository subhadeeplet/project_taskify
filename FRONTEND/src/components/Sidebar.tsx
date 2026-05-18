import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  PlusCircle,
  CheckSquare,
  ClipboardList,
  User as UserIcon,
  Menu,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogoutButton } from "@/components/LogoutButton";
import { useMemo, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["user", "provider"] },
  { href: "/tasks/marketplace", label: "Marketplace", icon: Store, roles: ["user", "provider"] },
  { href: "/tasks/create", label: "Create Task", icon: PlusCircle, roles: ["user"] },
  { href: "/tasks/created", label: "My Created Tasks", icon: ClipboardList, roles: ["user"] },
  { href: "/tasks/assigned", label: "My Assigned Tasks", icon: CheckSquare, roles: ["user", "provider"] },
  { href: "/profile", label: "Profile", icon: UserIcon, roles: ["user", "provider"] },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const visibleNavItems = useMemo(() => {
    const role = user?.role === "provider" ? "provider" : "user";
    return navItems.filter((item) => item.roles.includes(role));
  }, [user?.role]);

  const NavLinks = () => (
    <div className="flex flex-col gap-2 p-4">
      {visibleNavItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          location === item.href || (location === "/" && item.href === "/dashboard");
        return (
          <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${isActive ? "font-medium" : "text-muted-foreground"}`}
              data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
        <span className="font-semibold text-lg text-primary">Taskify</span>
        <div className="flex items-center gap-2">
          <LogoutButton
            variant="ghost"
            size="icon"
            label=""
            showIcon
            className="text-muted-foreground"
            aria-label="Logout"
          />
          <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0 flex flex-col">
            <div className="p-6 pb-2">
              <h2 className="text-lg font-semibold text-primary">Taskify</h2>
              {user && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  <Badge variant="secondary" className="capitalize text-xs">
                    {user.role}
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-auto">
              <NavLinks />
            </div>
            <div className="p-4 border-t">
              <LogoutButton className="w-full justify-start gap-3" />
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </div>

      <div className="hidden md:flex flex-col w-64 border-r bg-card min-h-screen">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">Taskify</h1>
          {user && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <Badge variant="secondary" className="capitalize text-xs">
                {user.role}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-auto py-2">
          <NavLinks />
        </div>
        <div className="p-4 border-t">
          <LogoutButton
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            data-testid="button-logout-desktop"
          />
        </div>
      </div>
    </>
  );
}
