
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import PhoneOTP from "@/components/ui/phone-otp";

const ParentLogin = () => {
  const [step, setStep] = useState<"details" | "verification">("details");
  const [parentName, setParentName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const navigate = useNavigate();

  // Handle initial form submission
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!parentName) {
      toast.error("Please enter your name");
      return;
    }
    
    if (!studentName) {
      toast.error("Please enter your child's name");
      return;
    }
    
    if (!phoneVerified) {
      toast.error("Please verify your phone number");
      return;
    }
    
    setStep("verification");
  };

  // Handle phone verification success
  const handlePhoneVerified = (phone: string) => {
    setPhoneVerified(true);
    setVerifiedPhone(phone);
  };

  // Handle login completion
  const handleLogin = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Login successful", {
        description: "Welcome to the Parent Dashboard"
      });
      navigate("/parent-dashboard");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="absolute inset-0 bg-noise pointer-events-none"></div>
      <Navbar />
      
      <div className="container flex items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Parent Login</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to monitor your child's attendance
            </p>
          </div>

          <Card className="shadow-lg border overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle>Parent Access</CardTitle>
              <CardDescription>
                {step === "details" 
                  ? "Enter your details and verify your phone number" 
                  : "Complete your login to access the dashboard"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {step === "details" ? (
                <form onSubmit={handleContinue} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-name">Your Name</Label>
                    <Input
                      id="parent-name"
                      placeholder="Enter your full name"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Student's Name</Label>
                    <Input
                      id="student-name"
                      placeholder="Enter your child's name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="mt-6 py-4 border-t border-b">
                    <h3 className="text-sm font-medium mb-3">Phone Verification</h3>
                    {phoneVerified ? (
                      <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Phone Verified</p>
                            <p className="text-xs text-muted-foreground">{verifiedPhone}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setPhoneVerified(false)}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <PhoneOTP onVerified={handlePhoneVerified} />
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-10 mt-2"
                    disabled={!phoneVerified}
                  >
                    Continue
                  </Button>
                </form>
              ) : (
                <div className="space-y-6 py-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bell className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Attendance Notifications</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          You'll receive WhatsApp notifications for absences and late arrivals
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Parent Name</p>
                      <p className="text-sm">{parentName}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Student Name</p>
                      <p className="text-sm">{studentName}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Phone Number</p>
                      <p className="text-sm">{verifiedPhone}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep("details")}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleLogin}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                          <span>Logging in...</span>
                        </div>
                      ) : (
                        "Complete Login"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentLogin;
