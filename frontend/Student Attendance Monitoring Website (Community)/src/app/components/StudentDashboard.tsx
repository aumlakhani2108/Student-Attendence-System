import React from 'react';
import { LogOut, AlertTriangle, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { AttendanceRecord, Subject } from '../App';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface StudentDashboardProps {
  onLogout: () => void;
  attendanceRecords: AttendanceRecord[];
  subjects: Subject[];
  currentStudentId: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onLogout,
  attendanceRecords,
  subjects,
  currentStudentId
}) => {
  // Calculate attendance statistics for current student
  const getAttendanceStats = () => {
    return subjects.map(subject => {
      const subjectRecords = attendanceRecords.filter(
        record => record.studentId === currentStudentId && record.subjectId === subject.id
      );
      
      const totalClasses = subjectRecords.length;
      const attendedClasses = subjectRecords.filter(record => record.present).length;
      const percentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
      
      return {
        subject,
        totalClasses,
        attendedClasses,
        percentage: Math.round(percentage * 100) / 100
      };
    });
  };

  const attendanceStats = getAttendanceStats();
  const lowAttendanceSubjects = attendanceStats.filter(stat => stat.percentage < 75);
  const averageAttendance = attendanceStats.reduce((sum, stat) => sum + stat.percentage, 0) / attendanceStats.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Student Dashboard
                </h1>
                <p className="text-sm text-gray-600">Welcome back, Alice Johnson</p>
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
        {/* Low Attendance Alerts */}
        {lowAttendanceSubjects.length > 0 && (
          <div className="mb-8">
            <Alert className="border-orange-200 bg-orange-50/80 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-800">Attendance Alert</AlertTitle>
              <AlertDescription className="text-orange-700 mt-2">
                Your attendance is below 75% in the following subjects:
                <div className="mt-2 space-y-1">
                  {lowAttendanceSubjects.map(stat => (
                    <div key={stat.subject.id} className="font-medium">
                      • {stat.subject.name} ({stat.subject.code}): {stat.percentage}%
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Overall Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(averageAttendance)}%
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <TrendingUp className="w-3 h-3" />
                Across all subjects
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Total Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {subjects.length}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Active courses
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Classes Attended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {attendanceStats.reduce((sum, stat) => sum + stat.attendedClasses, 0)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                This month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Low Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {lowAttendanceSubjects.length}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Subjects below 75%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Analytics */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Subject-wise Attendance Analytics
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your attendance across all subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {attendanceStats.map(stat => (
                <div key={stat.subject.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{stat.subject.name}</h3>
                      <p className="text-sm text-gray-600">{stat.subject.code}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        stat.percentage >= 75 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {stat.percentage}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.attendedClasses}/{stat.totalClasses} classes
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress 
                      value={stat.percentage} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span className="font-medium">Required: 75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {stat.percentage < 75 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="text-sm text-orange-800">
                        <strong>Action Required:</strong> You need to attend{' '}
                        {Math.ceil((75 * stat.totalClasses - 100 * stat.attendedClasses) / 25)} more classes
                        to reach 75% attendance.
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};