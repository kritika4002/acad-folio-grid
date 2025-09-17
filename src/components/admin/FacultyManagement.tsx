import { useState } from "react";
import { Users, Plus, Search, Edit2, Trash2, Mail, Phone, Clock, Calendar, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: "Professor" | "Associate Professor" | "Assistant Professor" | "Lecturer" | "Instructor";
  specialization: string;
  maxHours: number;
  currentHours: number;
  availability: {
    [key: string]: string[]; // day: ["09:00-10:30", "11:00-12:30"]
  };
  courses: string[];
}

const FacultyManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterPosition, setFilterPosition] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [faculty, setFaculty] = useState<Faculty[]>([
    {
      id: "1",
      name: "Dr. Sarah Smith",
      email: "s.smith@university.edu",
      phone: "+1-555-0101",
      department: "Mathematics",
      position: "Professor",
      specialization: "Applied Mathematics, Calculus",
      maxHours: 20,
      currentHours: 15,
      availability: {
        Monday: ["09:00-10:30", "11:00-12:30", "14:00-15:30"],
        Tuesday: ["09:00-10:30", "11:00-12:30"],
        Wednesday: ["09:00-10:30", "11:00-12:30", "14:00-15:30"],
        Thursday: ["11:00-12:30", "14:00-15:30"],
        Friday: ["09:00-10:30"]
      },
      courses: ["MATH301", "MATH401"]
    },
    {
      id: "2",
      name: "Prof. Michael Johnson",
      email: "m.johnson@university.edu",
      phone: "+1-555-0102",
      department: "Physics",
      position: "Associate Professor",
      specialization: "Quantum Physics, Laboratory Research",
      maxHours: 18,
      currentHours: 16,
      availability: {
        Monday: ["11:00-12:30", "14:00-17:00"],
        Tuesday: ["09:00-12:30"],
        Wednesday: ["11:00-12:30", "14:00-17:00"],
        Thursday: ["09:00-12:30"],
        Friday: ["11:00-15:30"]
      },
      courses: ["PHYS401L", "PHYS301"]
    },
    {
      id: "3",
      name: "Ms. Emily Davis",
      email: "e.davis@university.edu",
      phone: "+1-555-0103",
      department: "English",
      position: "Assistant Professor",
      specialization: "Literature, Creative Writing",
      maxHours: 16,
      currentHours: 12,
      availability: {
        Monday: ["09:00-12:30", "14:00-15:30"],
        Tuesday: ["09:00-10:30", "14:00-17:00"],
        Wednesday: ["09:00-12:30"],
        Thursday: ["09:00-10:30", "14:00-17:00"],
        Friday: ["09:00-12:30"]
      },
      courses: ["ENG205", "ENG301"]
    }
  ]);

  const departments = ["Mathematics", "Physics", "English", "History", "Art", "Physical Education"];
  const positions = ["Professor", "Associate Professor", "Assistant Professor", "Lecturer", "Instructor"];
  const timeSlots = ["09:00-10:30", "11:00-12:30", "14:00-15:30", "16:00-17:30"];
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || member.department === filterDepartment;
    const matchesPosition = filterPosition === "all" || member.position === filterPosition;
    
    return matchesSearch && matchesDepartment && matchesPosition;
  });

  const [newFaculty, setNewFaculty] = useState<Partial<Faculty>>({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "Assistant Professor",
    specialization: "",
    maxHours: 16,
    currentHours: 0,
    availability: {},
    courses: []
  });

  const handleAddFaculty = () => {
    if (newFaculty.name && newFaculty.email && newFaculty.department) {
      const member: Faculty = {
        id: Date.now().toString(),
        currentHours: 0,
        availability: {},
        courses: [],
        ...newFaculty as Faculty
      };
      setFaculty([...faculty, member]);
      setNewFaculty({
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "Assistant Professor",
        specialization: "",
        maxHours: 16,
        currentHours: 0,
        availability: {},
        courses: []
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteFaculty = (id: string) => {
    setFaculty(faculty.filter(member => member.id !== id));
  };

  const getWorkloadStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return { status: "overloaded", color: "bg-destructive", text: "text-destructive" };
    if (percentage >= 75) return { status: "high", color: "bg-warning", text: "text-warning" };
    if (percentage >= 50) return { status: "moderate", color: "bg-primary", text: "text-primary" };
    return { status: "light", color: "bg-success", text: "text-success" };
  };

  const toggleAvailability = (day: string, slot: string) => {
    setNewFaculty(prev => {
      const availability = { ...prev.availability };
      if (!availability[day]) {
        availability[day] = [];
      }
      
      const daySlots = availability[day];
      if (daySlots.includes(slot)) {
        availability[day] = daySlots.filter(s => s !== slot);
      } else {
        availability[day] = [...daySlots, slot];
      }
      
      return { ...prev, availability };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Faculty Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage faculty members, their availability, and teaching assignments
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glow-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Faculty Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Dr. John Smith"
                    value={newFaculty.name}
                    onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="j.smith@university.edu"
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1-555-0100"
                    value={newFaculty.phone}
                    onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={newFaculty.department} onValueChange={(value) => setNewFaculty({ ...newFaculty, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select value={newFaculty.position} onValueChange={(value: any) => setNewFaculty({ ...newFaculty, position: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(position => (
                        <SelectItem key={position} value={position}>{position}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxHours">Max Weekly Hours</Label>
                  <Input
                    id="maxHours"
                    type="number"
                    min="8"
                    max="40"
                    value={newFaculty.maxHours}
                    onChange={(e) => setNewFaculty({ ...newFaculty, maxHours: parseInt(e.target.value) })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    placeholder="e.g., Applied Mathematics, Quantum Physics"
                    value={newFaculty.specialization}
                    onChange={(e) => setNewFaculty({ ...newFaculty, specialization: e.target.value })}
                  />
                </div>
              </div>

              {/* Availability Matrix */}
              <div className="space-y-4">
                <Label>Weekly Availability</Label>
                <div className="grid grid-cols-6 gap-2">
                  <div className="font-medium text-sm">Time</div>
                  {weekDays.map(day => (
                    <div key={day} className="font-medium text-sm text-center">{day}</div>
                  ))}
                  
                  {timeSlots.map(slot => (
                    <div key={slot} className="contents">
                      <div className="text-sm py-2">{slot}</div>
                      {weekDays.map(day => (
                        <div key={`${day}-${slot}`} className="flex justify-center">
                          <Checkbox
                            checked={newFaculty.availability?.[day]?.includes(slot) || false}
                            onCheckedChange={() => toggleAvailability(day, slot)}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFaculty}>
                Add Faculty Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card border-0 card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Faculty</p>
                <p className="text-2xl font-bold">{faculty.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0 card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Hours</p>
                <p className="text-2xl font-bold">{faculty.reduce((sum, member) => sum + member.currentHours, 0)}</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0 card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0 card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg Workload</p>
                <p className="text-2xl font-bold">
                  {Math.round(faculty.reduce((sum, member) => sum + (member.currentHours / member.maxHours * 100), 0) / faculty.length)}%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="gradient-card border-0 card-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Faculty Table */}
      <Card className="gradient-card border-0 card-shadow">
        <CardHeader>
          <CardTitle>Faculty Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty Member</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Workload</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaculty.map((member) => {
                const workloadStatus = getWorkloadStatus(member.currentHours, member.maxHours);
                const availableDays = Object.keys(member.availability).length;
                
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.specialization}</div>
                      </div>
                    </TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {member.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${workloadStatus.color}`} />
                          <span className={`text-sm font-medium ${workloadStatus.text}`}>
                            {member.currentHours}/{member.maxHours}h
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1 rounded-full">
                          <div 
                            className={`h-full rounded-full ${workloadStatus.color}`}
                            style={{ width: `${Math.min((member.currentHours / member.maxHours) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {availableDays} days
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteFaculty(member.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyManagement;