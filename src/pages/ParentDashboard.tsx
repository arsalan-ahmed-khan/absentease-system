import { useState, useEffect } from "react";
import { Bell, Calendar, LogOut, Mail, User } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import AttendanceChart from "@/components/attendance/AttendanceChart";
import { fetchAttendanceRecords, fetchNotifications } from "@/lib/firestore"; // Updated imports

const ParentDashboard = () => {
  const [studentName] = useState("Michael Johnson");
  const [studentId] = useState("S2023003");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch attendance records from Firestore
        const records = await fetchAttendanceRecords(studentId);
        setAttendanceRecords(records);

        // Fetch notifications from Firestore
        const notifications = await fetchNotifications(studentId);
        setNotifications(notifications);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [studentId]);

  const handleLogout = () => {
    toast.info("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 py-24 mx-auto">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Parent Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor your child's attendance and receive notifications
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
                  <DropdownMenuLabel>Parent Account</DropdownMenuLabel>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-1 animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Student Information</CardTitle>
                <CardDescription>Details of your child</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-4">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 overflow-hidden">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium">{studentName}</h3>
                  <p className="text-muted-foreground">ID: {studentId}</p>
                  
                  <div className="w-full mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Class:</span>
                      <span className="text-sm">Science Group, Year 10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Attendance:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800">
                        92%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Contact:</span>
                      <span className="text-sm">parent@example.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Attendance Chart</CardTitle>
                <CardDescription>Visual representation of attendance data</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceChart />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Attendance Records</CardTitle>
                <CardDescription>Latest attendance activity</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.subject}</TableCell>
                        <TableCell>
                          <span className={`${
                            record.status === "present" ? "status-present" : 
                            record.status === "absent" ? "status-absent" : 
                            "status-late"
                          }`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{record.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Notification History</CardTitle>
                <CardDescription>WhatsApp and email alerts sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex p-4 rounded-lg border bg-card">
                      <div className="mr-4 flex-shrink-0">
                        {notification.title.includes("Absence") ? (
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-red-600" />
                          </div>
                        ) : notification.title.includes("Late") ? (
                          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-amber-600" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">{notification.date}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center">
                          <Badge variant="outline" className="text-xs">
                            {notification.sent ? "Sent via WhatsApp" : "Delivery failed"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
