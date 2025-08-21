import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  Settings, 
  BarChart3, 
  FileText, 
  Bell 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    isActive: true
  },
  {
    name: "Users",
    icon: Users,
    href: "/users",
    isActive: false
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    href: "/orders",
    isActive: false
  },
  {
    name: "Products",
    icon: Package,
    href: "/products",
    isActive: false
  },
  {
    name: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    isActive: false
  },
  {
    name: "Reports",
    icon: FileText,
    href: "/reports",
    isActive: false
  },
  {
    name: "Notifications",
    icon: Bell,
    href: "/notifications",
    isActive: false
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
    isActive: false
  }
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                  item.isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-primary/20" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-primary-foreground">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">admin@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}