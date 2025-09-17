import { useState } from "react";
import { BookOpen, Plus, Search, Edit2, Trash2, Users, Clock, MapPin, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  duration: number;
  type: "lecture" | "lab" | "tutorial" | "seminar";
  capacity: number;
  enrolled: number;
  instructor: string;
  description: string;
  prerequisites: string[];
  color: "math" | "science" | "english" | "history" | "art" | "pe";
}

const CourseManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      code: "MATH301",
      name: "Advanced Calculus",
      department: "Mathematics",
      credits: 3,
      duration: 90,
      type: "lecture",
      capacity: 40,
      enrolled: 35,
      instructor: "Dr. Smith",
      description: "Advanced topics in differential and integral calculus",
      prerequisites: ["MATH201", "MATH202"],
      color: "math"
    },
    {
      id: "2",
      code: "PHYS401L",
      name: "Quantum Physics Lab",
      department: "Physics",
      credits: 2,
      duration: 120,
      type: "lab",
      capacity: 20,
      enrolled: 18,
      instructor: "Prof. Johnson",
      description: "Hands-on quantum mechanics experiments",
      prerequisites: ["PHYS301", "PHYS302"],
      color: "science"
    },
    {
      id: "3",
      code: "ENG205",
      name: "Shakespeare Studies",
      department: "English",
      credits: 3,
      duration: 75,
      type: "seminar",
      capacity: 25,
      enrolled: 22,
      instructor: "Ms. Davis",
      description: "In-depth analysis of Shakespeare's major works",
      prerequisites: ["ENG101"],
      color: "english"
    }
  ]);

  const departments = ["Mathematics", "Physics", "English", "History", "Art", "Physical Education"];
  const courseTypes = ["lecture", "lab", "tutorial", "seminar"];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || course.department === filterDepartment;
    const matchesType = filterType === "all" || course.type === filterType;
    
    return matchesSearch && matchesDepartment && matchesType;
  });

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    code: "",
    name: "",
    department: "",
    credits: 3,
    duration: 90,
    type: "lecture",
    capacity: 40,
    instructor: "",
    description: "",
    prerequisites: [],
    color: "math"
  });

  const handleAddCourse = () => {
    if (newCourse.code && newCourse.name && newCourse.department) {
      const course: Course = {
        id: Date.now().toString(),
        enrolled: 0,
        prerequisites: [],
        ...newCourse as Course
      };
      setCourses([...courses, course]);
      setNewCourse({
        code: "",
        name: "",
        department: "",
        credits: 3,
        duration: 90,
        type: "lecture",
        capacity: 40,
        instructor: "",
        description: "",
        prerequisites: [],
        color: "math"
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const getEnrollmentStatus = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return { status: "full", color: "bg-destructive" };
    if (percentage >= 70) return { status: "high", color: "bg-warning" };
    return { status: "available", color: "bg-success" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Course Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage course catalog, enrollment, and scheduling requirements
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glow-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., MATH301"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Advanced Calculus"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newCourse.department} onValueChange={(value) => setNewCourse({ ...newCourse, department: value })}>
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
                <Label htmlFor="type">Course Type</Label>
                <Select value={newCourse.type} onValueChange={(value: any) => setNewCourse({ ...newCourse, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {courseTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  min="1"
                  max="6"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="30"
                  max="180"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="200"
                  value={newCourse.capacity}
                  onChange={(e) => setNewCourse({ ...newCourse, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  placeholder="e.g., Dr. Smith"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Course description..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCourse}>
                Add Course
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
                <p className="text-muted-foreground text-sm">Total Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0 card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Enrollment</p>
                <p className="text-2xl font-bold">{courses.reduce((sum, course) => sum + course.enrolled, 0)}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
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
                <p className="text-muted-foreground text-sm">Avg Duration</p>
                <p className="text-2xl font-bold">
                  {Math.round(courses.reduce((sum, course) => sum + course.duration, 0) / courses.length)}m
                </p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
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
                placeholder="Search courses..."
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
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {courseTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Table */}
      <Card className="gradient-card border-0 card-shadow">
        <CardHeader>
          <CardTitle>Course Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => {
                const enrollmentStatus = getEnrollmentStatus(course.enrolled, course.capacity);
                
                return (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.code}</div>
                        <div className="text-sm text-muted-foreground">{course.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{course.department}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`subject-${course.color} border-0`}>
                        {course.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}m
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${enrollmentStatus.color}`} />
                        {course.enrolled}/{course.capacity}
                      </div>
                    </TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteCourse(course.id)}
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

export default CourseManagement;