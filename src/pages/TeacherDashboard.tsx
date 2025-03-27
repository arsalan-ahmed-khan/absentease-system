
import { useState, useEffect } from "react";
import { LayoutDashboard, UserCheck, Bell, RefreshCw, Layers, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRDisplay from "@/components/attendance/QRDisplay";
import AttendanceChart from "@/components/attendance/AttendanceChart";
import WhatsAppNotification from "@/components/notifications/WhatsAppNotification";

// Mock data
const ATTENDANCE_DATA = [
  { date: "2023-09-01", present: 24, absent: 3, late: 2 },
  { date: "2023-09-02", present: 23, absent: 4, late: 2 },
  { date: "2023-09-03", present: 25, absent: 2, late: 2 },
  { date: "2023-09-04", present: 22, absent: 5, late: 2 },
  { date: "2023-09-05", present: 24, absent: 2, late: 3 },
  { date: "2023-09-06", present: 26, absent: 1, late: 2 },
  { date: "2023-09-07", present: 25, absent: 3, late: 1 },
];

const STUDENT_DATA = [
  { id: "1", name: "Alice Smith", status: "present" },
  { id: "2", name: "Bob Johnson", status: "absent" },
  { id: "3", name: "Charlie Brown", status: "late" },
  { id: "4", name: "Diana Wilson", status: "present" },
  { id: "5", name: "Ethan Davis", status: "present" },
];

const TEACHER_NAME = "Ms. Johnson";
const CLASS_NAME = "Grade 10-A";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="absolute inset-0 bg-noise pointer-events-none"></div>
      
      {/* Dashboard Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          <LayoutDashboard className="h-6 w-6" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Teacher Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {TEACHER_NAME} | {CLASS_NAME}
            </p>
          </div>
          <button 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            onClick={handleRefresh}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Today's Attendance</CardTitle>
                  <CardDescription>
                    Attendance summary for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <span className="text-3xl font-bold text-primary">24</span>
                      <p className="text-xs text-muted-foreground">Present</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-3xl font-bold text-destructive">3</span>
                      <p className="text-xs text-muted-foreground">Absent</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-3xl font-bold text-amber-500">2</span>
                      <p className="text-xs text-muted-foreground">Late</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Weekly Overview</CardTitle>
                  <CardDescription>
                    Last 7 days attendance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AttendanceChart data={ATTENDANCE_DATA} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Next Class</CardTitle>
                  <CardDescription>
                    Upcoming schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Mathematics</p>
                        <p className="text-xs text-muted-foreground">10:30 AM - 11:30 AM</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Room 102</p>
                      <p>29 students expected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <QRDisplay />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
                  <CardDescription>
                    Latest attendance records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {STUDENT_DATA.map((student) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {student.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          student.status === "present" 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                            : student.status === "absent"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <QRDisplay />
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Weekly Stats</CardTitle>
                  <CardDescription>
                    Attendance trends for the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AttendanceChart data={ATTENDANCE_DATA} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid gap-6">
              <WhatsAppNotification 
                studentData={STUDENT_DATA.map(student => ({ id: student.id, name: student.name }))} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
