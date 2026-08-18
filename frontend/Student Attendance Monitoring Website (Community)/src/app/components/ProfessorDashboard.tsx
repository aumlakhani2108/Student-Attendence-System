import React, { useState } from "react";
import {
  LogOut,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  BookOpen,
} from "lucide-react";
import { AttendanceRecord, Student, Subject } from "../App";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface ProfessorDashboardProps {
  onLogout: () => void;
  students: Student[];
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  onUpdateAttendance: (
    studentId: string,
    subjectId: string,
    date: string,
    present: boolean,
  ) => void;
}

export const ProfessorDashboard: React.FC<
  ProfessorDashboardProps
> = ({
  onLogout,
  students,
  subjects,
  attendanceRecords,
  onUpdateAttendance,
}) => {
  const [selectedSubject, setSelectedSubject] =
    useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  // Generate last 7 days for quick date selection
  const getRecentDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const recentDates = getRecentDates();

  // Get attendance for selected subject and date
  const getAttendanceForDate = (
    studentId: string,
    subjectId: string,
    date: string,
  ) => {
    const record = attendanceRecords.find(
      (r) =>
        r.studentId === studentId &&
        r.subjectId === subjectId &&
        r.date === date,
    );
    return record?.present || false;
  };

  // Calculate overall statistics
  const getOverallStats = () => {
    const totalRecords = attendanceRecords.length;
    const presentRecords = attendanceRecords.filter(
      (r) => r.present,
    ).length;
    const attendanceRate =
      totalRecords > 0
        ? (presentRecords / totalRecords) * 100
        : 0;

    return {
      totalStudents: students.length,
      totalSubjects: subjects.length,
      overallAttendanceRate:
        Math.round(attendanceRate * 100) / 100,
      totalClassesConducted: Math.floor(
        totalRecords / students.length,
      ),
    };
  };

  const stats = getOverallStats();

  const handleAttendanceChange = (
    studentId: string,
    present: boolean,
  ) => {
    if (selectedSubject && selectedDate) {
      onUpdateAttendance(
        studentId,
        selectedSubject,
        selectedDate,
        present,
      );
    }
  };

  const markAllPresent = () => {
    if (selectedSubject && selectedDate) {
      students.forEach((student) => {
        onUpdateAttendance(
          student.id,
          selectedSubject,
          selectedDate,
          true,
        );
      });
    }
  };

  const markAllAbsent = () => {
    if (selectedSubject && selectedDate) {
      students.forEach((student) => {
        onUpdateAttendance(
          student.id,
          selectedSubject,
          selectedDate,
          false,
        );
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Professor Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Attendance Management System
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalStudents}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Users className="w-3 h-3" />
                Active students
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">
                Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalSubjects}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Active courses
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">
                Overall Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.overallAttendanceRate}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                All subjects
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">
                Classes Conducted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {stats.totalClassesConducted}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                This month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Marking */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Mark Attendance
            </CardTitle>
            <CardDescription>
              Select subject and date to mark student attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id}
                      >
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Quick date selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Date Selection
              </label>
              <div className="flex flex-wrap gap-2">
                {recentDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      selectedDate === date
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {new Date(date).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" },
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk actions */}
            {selectedSubject && (
              <div className="flex gap-2 mb-6">
                <Button
                  onClick={markAllPresent}
                  variant="outline"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All Present
                </Button>
                <Button
                  onClick={markAllAbsent}
                  variant="outline"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Mark All Absent
                </Button>
              </div>
            )}

            {/* Attendance table */}
            {selectedSubject ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-medium text-gray-800">
                    {
                      subjects.find(
                        (s) => s.id === selectedSubject,
                      )?.name
                    }{" "}
                    -{" "}
                    {new Date(selectedDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {students.map((student) => {
                    const isPresent = getAttendanceForDate(
                      student.id,
                      selectedSubject,
                      selectedDate,
                    );
                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {student.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {student.rollNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                              checked={isPresent}
                              onCheckedChange={(checked) =>
                                handleAttendanceChange(
                                  student.id,
                                  !!checked,
                                )
                              }
                            />
                            <span
                              className={`text-sm font-medium ${
                                isPresent
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {isPresent ? "Present" : "Absent"}
                            </span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>
                  Please select a subject to mark attendance
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};