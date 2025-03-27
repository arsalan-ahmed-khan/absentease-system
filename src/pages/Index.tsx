
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { User, QrCode, Users, ChevronRight, Zap, ShieldCheck, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  useEffect(() => {
    // Apply animation to hero elements
    const animationDelay = (element: HTMLElement, delay: number) => {
      setTimeout(() => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, delay);
    };

    const heroElements = document.querySelectorAll('.hero-animate');
    heroElements.forEach((element, index) => {
      animationDelay(element as HTMLElement, 300 + (index * 100));
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="absolute inset-0 bg-noise pointer-events-none"></div>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-accent text-accent-foreground mb-2 hero-animate opacity-0" style={{ transform: "translateY(20px)", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
              <Zap className="h-3.5 w-3.5 mr-1" />
              <span>Automated Attendance Made Simple</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight hero-animate opacity-0" style={{ transform: "translateY(20px)", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
              QR Code Attendance System
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4 hero-animate opacity-0" style={{ transform: "translateY(20px)", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
              Streamline attendance tracking with our QR code system. Easy for teachers, convenient for students, and informative for parents.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 hero-animate opacity-0" style={{ transform: "translateY(20px)", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
              <Link to="/teacher-login">
                <Button className="h-11 px-6 gap-2" size="lg">
                  <User className="h-4 w-4" />
                  Teacher Login
                </Button>
              </Link>
              <Link to="/student-scan">
                <Button variant="outline" className="h-11 px-6 gap-2" size="lg">
                  <QrCode className="h-4 w-4" />
                  Scan Attendance
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <Card className="card-elegant animate-fade-in [animation-delay:200ms] opacity-0">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">For Teachers</h3>
                <p className="text-muted-foreground">
                  Generate QR codes for classes, track attendance in real-time, and export reports with ease.
                </p>
                <Link to="/teacher-login" className="mt-2 inline-flex items-center text-primary hover:underline text-sm font-medium">
                  Login Dashboard
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="card-elegant animate-fade-in [animation-delay:400ms] opacity-0">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">For Students</h3>
                <p className="text-muted-foreground">
                  Scan QR codes to mark attendance instantly. No more manual roll calls or paperwork.
                </p>
                <Link to="/student-scan" className="mt-2 inline-flex items-center text-primary hover:underline text-sm font-medium">
                  Scan QR Code
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="card-elegant animate-fade-in [animation-delay:600ms] opacity-0">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">For Parents</h3>
                <p className="text-muted-foreground">
                  Monitor your child's attendance, receive notifications for absences, and view attendance history.
                </p>
                <Link to="/parent-dashboard" className="mt-2 inline-flex items-center text-primary hover:underline text-sm font-medium">
                  Parent Portal
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Why Choose Our System?
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Our QR code attendance system offers numerous advantages over traditional methods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3 p-6 animate-fade-in [animation-delay:200ms] opacity-0">
              <div className="p-3 bg-accent rounded-full">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Time Efficient</h3>
              <p className="text-muted-foreground">
                Reduce attendance taking time from minutes to seconds with quick QR code scans.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-6 animate-fade-in [animation-delay:400ms] opacity-0">
              <div className="p-3 bg-accent rounded-full">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Reliable & Secure</h3>
              <p className="text-muted-foreground">
                Prevent proxy attendance with dynamically generated QR codes that expire quickly.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-6 animate-fade-in [animation-delay:600ms] opacity-0">
              <div className="p-3 bg-accent rounded-full">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Instant Notifications</h3>
              <p className="text-muted-foreground">
                Parents receive real-time WhatsApp alerts when their child is absent from class.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-muted/50 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-primary" />
              <span className="font-display font-medium">AbsentEase</span>
            </div>
            
            <div className="flex space-x-6">
              <Link to="/teacher-login" className="text-muted-foreground hover:text-foreground transition-colors">
                Teacher Login
              </Link>
              <Link to="/student-scan" className="text-muted-foreground hover:text-foreground transition-colors">
                Student Portal
              </Link>
              <Link to="/parent-dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Parent Portal
              </Link>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AbsentEase. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
