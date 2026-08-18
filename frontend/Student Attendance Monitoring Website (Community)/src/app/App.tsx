import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';

export type UserType = 'student' | 'professor' | null;

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface AttendanceRecord {
  studentId: string;
  subjectId: string;
  date: string;
  present: boolean;
}

// Mock data
export const students: Student[] = [
  { id: '1', name: 'Alice Johnson', rollNumber: 'CS001' },
  { id: '2', name: 'Bob Smith', rollNumber: 'CS002' },
  { id: '3', name: 'Charlie Brown', rollNumber: 'CS003' },
  { id: '4', name: 'Diana Wilson', rollNumber: 'CS004' },
  { id: '5', name: 'Emma Davis', rollNumber: 'CS005' },
];

export const subjects: Subject[] = [
  { id: '1', name: 'Data Structures', code: 'CS201' },
  { id: '2', name: 'Database Systems', code: 'CS301' },
  { id: '3', name: 'Web Development', code: 'CS401' },
  { id: '4', name: 'Machine Learning', code: 'CS501' },
];

// Generate mock attendance data
export const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const dates = [];
  
  // Generate last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  students.forEach(student => {
    subjects.forEach(subject => {
      dates.forEach(date => {
        // Random attendance with 75% presence probability
        const isPresent = Math.random() > 0.25;
        records.push({
          studentId: student.id,
          subjectId: subject.id,
          date,
          present: isPresent
        });
      });
    });
  });

  return records;
};

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'student' | 'professor'>('landing');
  const [currentUser, setCurrentUser] = useState<UserType>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(generateMockAttendance());

  const handleLogin = (userType: UserType) => {
    setCurrentUser(userType);
    setCurrentView(userType === 'student' ? 'student' : 'professor');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const updateAttendance = (studentId: string, subjectId: string, date: string, present: boolean) => {
    setAttendanceRecords(prev => {
      const updated = prev.filter(record => 
        !(record.studentId === studentId && record.subjectId === subjectId && record.date === date)
      );
      updated.push({ studentId, subjectId, date, present });
      return updated;
    });
  };

  if (currentView === 'landing') {
    return <LandingPage onLogin={handleLogin} />;
  }

  if (currentView === 'student') {
    return (
      <StudentDashboard 
        onLogout={handleLogout}
        attendanceRecords={attendanceRecords}
        subjects={subjects}
        currentStudentId="1" // Mock logged in student
      />
    );
  }

  if (currentView === 'professor') {
    return (
      <ProfessorDashboard 
        onLogout={handleLogout}
        students={students}
        subjects={subjects}
        attendanceRecords={attendanceRecords}
        onUpdateAttendance={updateAttendance}
      />
    );
  }

  return null;
}