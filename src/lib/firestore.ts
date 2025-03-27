import { db } from "firebaseConfig.ts";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

// Add a new student
export async function addStudent(student: { name: string; studentId: string; class: string }) {
  const studentsRef = collection(db, "students");
  await addDoc(studentsRef, student);
}

// Fetch all students
export async function fetchStudents() {
  const studentsRef = collection(db, "students");
  const snapshot = await getDocs(studentsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add attendance record
export async function addAttendance(record: { studentId: string; subject: string; status: string; timeIn: string; date: string }) {
  const attendanceRef = collection(db, "attendance");
  await addDoc(attendanceRef, record);
}

// Fetch attendance records for a specific date
export async function fetchAttendance(date: string) {
  const attendanceRef = collection(db, "attendance");
  const q = query(attendanceRef, where("date", "==", date));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Update attendance status
export async function updateAttendanceStatus(recordId: string, status: string, timeIn: string) {
  const recordRef = doc(db, "attendance", recordId);
  await updateDoc(recordRef, { status, timeIn });
}

// Add a notification
export async function addNotification(notification: { title: string; message: string; date: string; sent: boolean }) {
  const notificationsRef = collection(db, "notifications");
  await addDoc(notificationsRef, notification);
}

// Fetch notifications
export async function fetchAllNotifications() {
  const notificationsRef = collection(db, "notifications");
  const snapshot = await getDocs(notificationsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const fetchAttendanceRecords = async (studentId: string) => {
  const attendanceCollection = collection(db, "attendance");
  const q = query(attendanceCollection, where("studentId", "==", studentId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchNotifications = async (studentId: string) => {
  const notificationsCollection = collection(db, "notifications");
  const q = query(notificationsCollection, where("studentId", "==", studentId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Other exports
// Removed redundant export of fetchTodayClasses

export const fetchAttendanceByDate = async (date: string) => {
  const attendanceRef = collection(db, "attendance");
  const q = query(attendanceRef, where("date", "==", date));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add the fetchTodayClasses function if it doesn't exist
export const fetchTodayClasses = async (date: string) => {
  const classesRef = collection(db, "classes");
  const q = query(classesRef, where("date", "==", date));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Replace mock QR code data generation with actual Firestore logic
export const fetchQRCodeData = async (subjectId: string) => {
  const qrCodesRef = collection(db, "qrCodes");
  const q = query(qrCodesRef, where("subjectId", "==", subjectId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};