
import { toast } from "sonner";

// Twilio WhatsApp notification interface
interface TwilioWhatsAppMessage {
  to: string;        // Phone number in E.164 format: +1XXXXXXXXXX
  message: string;   // Message content
  studentName?: string;
  subject?: string;
  date?: string;
  status?: string;
}

/**
 * Send a WhatsApp notification via Twilio
 * This is a frontend wrapper for the Twilio API
 * In production, this should call a backend endpoint that handles Twilio API calls securely
 */
export async function sendWhatsAppNotification(data: TwilioWhatsAppMessage): Promise<boolean> {
  try {
    // In production, this would call your backend API
    // For demo purposes, we'll simulate a successful API call
    console.log("Sending WhatsApp notification:", data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Format the message for console display
    const formattedMessage = `
      To: ${data.to}
      Message: ${data.message}
      ${data.studentName ? `Student: ${data.studentName}` : ''}
      ${data.subject ? `Subject: ${data.subject}` : ''}
      ${data.date ? `Date: ${data.date}` : ''}
      ${data.status ? `Status: ${data.status}` : ''}
    `;
    
    console.log("WhatsApp notification would be sent:", formattedMessage);
    
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    toast.error("Failed to send WhatsApp notification");
    return false;
  }
}

/**
 * Format a phone number to E.164 format required by Twilio
 * @param phoneNumber - Phone number in format (XXX) XXX-XXXX
 * @returns Phone number in format +1XXXXXXXXXX
 */
export function formatPhoneForTwilio(phoneNumber: string): string {
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  
  // Add US country code if not present (assuming US numbers)
  return digitsOnly.startsWith("1") ? `+${digitsOnly}` : `+1${digitsOnly}`;
}

// Function to generate attendance notification message
export function generateAttendanceMessage(
  studentName: string,
  status: "absent" | "late" | "present",
  subject: string,
  date: string,
): string {
  switch (status) {
    case "absent":
      return `Attendance Alert: ${studentName} was marked absent for ${subject} on ${date}.`;
    case "late":
      return `Attendance Alert: ${studentName} arrived late for ${subject} on ${date}.`;
    case "present":
      return `Attendance Update: ${studentName} was present for ${subject} on ${date}.`;
    default:
      return `Attendance Update: ${studentName}'s attendance status for ${subject} on ${date} has been updated.`;
  }
}
