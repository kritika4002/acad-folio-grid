import { useState } from "react";
import { 
  Search, 
  GraduationCap, 
  Users, 
  Shield, 
  Calendar,
  BookOpen,
  Clock,
  Settings,
  User,
  Bell,
  FileText,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentView: "student" | "faculty" | "admin";
  onViewChange: (view: "student" | "faculty" | "admin") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Sidebar = ({ currentView, onViewChange, searchQuery, onSearchChange }: SidebarProps) => {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");

  const menuSections = {
    student: [
      { id: "dashboard", label: "Dashboard", icon: BarChart3, badge: null },
      { id: "schedule", label: "My Schedule", icon: Calendar, badge: null },
      { id: "courses", label: "My Courses", icon: BookOpen, badge: "6" },
      { id: "grades", label: "Grades", icon: FileText, badge: null },
      { id: "profile", label: "Profile", icon: User, badge: null },
    ],
    faculty: [
      { id: "dashboard", label: "Dashboard", icon: BarChart3, badge: null },
      { id: "schedule", label: "Schedule", icon: Calendar, badge: null },
      { id: "courses", label: "My Courses", icon: BookOpen, badge: "8" },
      { id: "students", label: "Students", icon: Users, badge: "156" },
      { id: "attendance", label: "Attendance", icon: Clock, badge: null },
      { id: "profile", label: "Profile", icon: User, badge: null },
    ],
    admin: [
      { id: "dashboard", label: "Dashboard", icon: BarChart3, badge: null },
      { id: "users", label: "Users", icon: Users, badge: "1,250" },
      { id: "courses", label: "Courses", icon: BookOpen, badge: "45" },
      { id: "schedule", label: "Schedules", icon: Calendar, badge: null },
      { id: "reports", label: "Reports", icon: FileText, badge: null },
      { id: "settings", label: "Settings", icon: Settings, badge: null },
    ],
  };

  const viewIcons = {
    student: GraduationCap,
    faculty: Users,
    admin: Shield,
  };

  const searchResults = [
    { type: "class", name: "Advanced Mathematics", instructor: "Dr. Smith", room: "Room 101" },
    { type: "faculty", name: "Prof. Johnson", department: "Physics", email: "j.johnson@university.edu" },
    { type: "class", name: "English Literature", instructor: "Ms. Davis", room: "Room 304" },
  ];

  const filteredResults = searchQuery 
    ? searchResults.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="fixed left-0 top-0 h-full w-64 gradient-card border-r border-border z-50">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center glow-primary">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg gradient-primary bg-clip-text text-transparent">
              EduScheduler
            </h2>
            <p className="text-xs text-muted-foreground">Academic Timetable</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search classes, faculty..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-muted/50 border-border/50 focus:bg-background transition-smooth"
          />
          
          {/* Search Results Dropdown */}
          {searchQuery && filteredResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {filteredResults.map((result, index) => (
                <div key={index} className="p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{result.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.type === "class" 
                          ? `${result.instructor} • ${result.room}`
                          : `${result.department} • ${result.email}`}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {result.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Switcher */}
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Switch View
          </p>
          <div className="space-y-2">
            {(["student", "faculty", "admin"] as const).map((view) => {
              const Icon = viewIcons[view];
              return (
                <Button
                  key={view}
                  variant={currentView === view ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(view)}
                  className={cn(
                    "w-full justify-start transition-smooth",
                    currentView === view && "glow-primary"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="capitalize">{view} View</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Navigation Menu */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Navigation
          </p>
          <nav className="space-y-1">
            {menuSections[currentView].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenuItem === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveMenuItem(item.id)}
                  className={cn(
                    "w-full justify-start transition-smooth hover:bg-muted/70",
                    isActive && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs bg-primary/20 text-primary border-0">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground capitalize">{currentView}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;