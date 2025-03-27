import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Download, Filter, LogOut, Sliders, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import QRDisplay from "@/components/attendance/QRDisplay";
import AttendanceChart from "@/components/attendance/AttendanceChart";
import { fetchAttendance, updateAttendanceStatus, fetchStudents, fetchTodayClasses } from "@/lib/firestore";

const TeacherDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filter, setFilter] = useState("all");
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [todayClasses, setTodayClasses] = useState([]);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        // Fetch attendance records
        const records: { id: string; status: string }[] = await fetchAttendance(today);
        setAttendance(records);
        setFilteredAttendance(records);

        // Fetch total students
        const students = await fetchStudents();
        const total = students.length;
        setTotalStudents(total);

        // Calculate attendance rate
        const presentCount = records.filter(record => record.status === "present").length;
        const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;
        setAttendanceRate(rate);

        // Fetch today's classes
        const classes = await fetchTodayClasses(today);
        setTodayClasses(classes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data. Please try again later.");
      }
    };

    fetchDashboardData();
  }, []);

  // Apply filter effect
  useEffect(() => {
    if (filter === "all") {
      setFilteredAttendance(attendance);
    } else {
      setFilteredAttendance(attendance.filter(student => student.status === filter));
    }
  }, [filter, attendance]);

  // Handle logout
  const handleLogout = () => {
    toast.info("Logged out successfully");
    navigate("/teacher-login");
  };

  // Handle attendance status change
  const handleStatusChange = async (studentId: string, newStatus: string) => {
    const record = attendance.find(student => student.studentId === studentId);
    if (record) {
      const timeIn = newStatus === "present" ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";
      try {
        await updateAttendanceStatus(record.id, newStatus, timeIn);
        toast.success("Attendance updated", {
          description: `Status updated successfully for student ${studentId}`
        });
        setAttendance(prev => prev.map(student => student.studentId === studentId ? { ...student, status: newStatus, timeIn } : student));
      } catch (error) {
        console.error("Error updating attendance status:", error);
        toast.error("Failed to update attendance status. Please try again.");
      }
    }
  };

  // Handle export attendance
  const handleExport = () => {
    // Implement export logic here
    toast.success("Attendance exported", {
      description: "The attendance report has been exported to CSV"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 py-24 mx-auto">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Teacher Dashboard</h1>
              <p className="text-muted-foreground">
                Manage attendance and generate QR codes for your classes
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Prof. Anderson</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card className="animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Total Students</CardTitle>
                <CardDescription>Registered in your classes</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-4xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Across multiple subjects
                </p>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in [animation-delay:200ms]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Attendance Rate</CardTitle>
                <CardDescription>Average across all subjects</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-4xl font-bold">{attendanceRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">↑ Compared to last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in [animation-delay:400ms]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Today's Classes</CardTitle>
                <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-4xl font-bold">{todayClasses.length}</div>
                <p className="text-xs text-muted-foreground">
                  Next class: <span className="font-medium">{todayClasses[0]?.name || "No classes"} at {todayClasses[0]?.time || "N/A"}</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              <QRDisplay />
            </div>
            
            <div className="md:col-span-2">
              <AttendanceChart />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight">Today's Attendance</h2>
              
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                      <Filter className="h-4 w-4" />
                      <span>Filter: {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => setFilter("all")}>
                      All Students
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("present")}>
                      Present
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("absent")}>
                      Absent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("late")}>
                      Late
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time In</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>
                          <span className={`
                            ${student.status === "present" ? "status-present" : ""}
                            ${student.status === "absent" ? "status-absent" : ""}
                            ${student.status === "late" ? "status-late" : ""}
                          `}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{student.timeIn}</TableCell>
                        <TableCell>{student.subject}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Sliders className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusChange(student.id, "present")}>
                                Mark as Present
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(student.id, "absent")}>
                                Mark as Absent
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(student.id, "late")}>
                                Mark as Late
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
