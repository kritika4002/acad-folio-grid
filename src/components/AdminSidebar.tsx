import { useState } from "react";
import { 
  LayoutDashboard,
  BookOpen, 
  Users, 
  Building2, 
  Zap,
  Search,
  Calendar,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Bell,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AdminView = "dashboard" | "courses" | "faculty" | "classrooms" | "generator";

interface AdminSidebarProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

const AdminSidebar = ({ activeView, onViewChange }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    {
      id: "dashboard" as AdminView,
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Drag & drop scheduling",
      badge: null
    },
    {
      id: "courses" as AdminView,
      label: "Manage Courses",
      icon: BookOpen,
      description: "Course catalog & details",
      badge: "24"
    },
    {
      id: "faculty" as AdminView,
      label: "Manage Faculty",
      icon: Users,
      description: "Staff & availability",
      badge: "18"
    },
    {
      id: "classrooms" as AdminView,
      label: "Manage Classrooms",
      icon: Building2,
      description: "Rooms & resources",
      badge: "12"
    },
    {
      id: "generator" as AdminView,
      label: "Generate Timetable",
      icon: Zap,
      description: "AI-powered scheduling",
      badge: "New"
    }
  ];

  const quickActions = [
    { label: "Add Course", icon: BookOpen, action: () => onViewChange("courses") },
    { label: "Add Faculty", icon: Users, action: () => onViewChange("faculty") },
    { label: "Add Room", icon: Building2, action: () => onViewChange("classrooms") },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transition-all duration-300 gradient-card",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center glow-primary">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-sm gradient-primary bg-clip-text text-transparent">
                  Admin Panel
                </h2>
                <p className="text-xs text-muted-foreground">Timetable Manager</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 p-0"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-border/50 focus:bg-background transition-smooth"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="p-4 space-y-2">
        {!isCollapsed && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Main Navigation
          </p>
        )}
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size={isCollapsed ? "sm" : "default"}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full transition-smooth",
                isCollapsed ? "h-12 px-0" : "justify-start h-auto py-3",
                isActive && "glow-primary",
                !isActive && "hover:bg-muted/70"
              )}
            >
              <Icon className={cn("w-5 h-5", isCollapsed ? "" : "mr-3")} />
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badge === "New" ? "default" : "secondary"} 
                        className={cn(
                          "text-xs",
                          item.badge === "New" && "bg-primary/20 text-primary border-0 glow-primary"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
              )}
            </Button>
          );
        })}
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Quick Actions
          </p>
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="w-full justify-start transition-smooth hover:bg-muted/50"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            System Status
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs">Active Classes</span>
              <Badge variant="secondary" className="bg-success/20 text-success border-0">180</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Conflicts</span>
              <Badge variant="destructive" className="bg-destructive/20 text-destructive border-0">3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Utilization</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-0">87%</Badge>
            </div>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground">System Administrator</p>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Bell className="w-4 h-4" />
            </Button>
            {!isCollapsed && (
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;