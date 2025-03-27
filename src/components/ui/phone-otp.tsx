
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

interface PhoneOTPProps {
  onVerified: (phone: string) => void;
  className?: string;
}

const PhoneOTP: React.FC<PhoneOTPProps> = ({ onVerified, className = "" }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  // Handle phone number input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  // Send OTP code
  const handleSendOTP = () => {
    // Basic validation
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    // Simulate API call to send OTP
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast.success("Verification code sent", {
        description: `A 6-digit code has been sent to ${phoneNumber}`
      });
    }, 1000);
  };

  // Verify OTP code
  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      // For demo purposes, accept any 6-digit code
      setIsLoading(false);
      toast.success("Phone verified successfully");
      onVerified(phoneNumber);
    }, 1500);
  };

  if (!otpSent) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="h-10"
          />
          <p className="text-xs text-muted-foreground">
            We'll send a verification code to this number
          </p>
        </div>
        <Button
          onClick={handleSendOTP}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
              <span>Sending...</span>
            </div>
          ) : (
            "Send Verification Code"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <div className="flex justify-center py-2">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, index) => (
                  <InputOTPSlot key={index} {...slot} index={index} />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Enter the 6-digit code sent to {phoneNumber}
        </p>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => setOtpSent(false)}
          className="flex-1"
          disabled={isLoading}
        >
          Change Number
        </Button>
        <Button
          onClick={handleVerifyOTP}
          className="flex-1"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            "Verify"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PhoneOTP;
