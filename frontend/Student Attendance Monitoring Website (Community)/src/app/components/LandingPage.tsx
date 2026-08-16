import React from 'react';
import { UserType } from '../App';
import { GraduationCap, Users, BarChart3, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onLogin: (userType: UserType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-7xl pt-20 pb-32 sm:pt-48 sm:pb-40">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-20"></div>
                  <div className="relative bg-white p-6 rounded-full shadow-xl">
                    <GraduationCap className="w-16 h-16 text-blue-600" />
                  </div>
                </div>
              </div>

              <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                AttendanceHub
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                Smart attendance monitoring and analytics platform for educational institutions. 
                Track, analyze, and improve student engagement with powerful insights.
              </p>

              {/* Login Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <button
                  onClick={() => onLogin('student')}
                  className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <GraduationCap className="w-6 h-6" />
                    <span className="text-lg font-semibold">Login as Student</span>
                  </div>
                </button>

                <button
                  onClick={() => onLogin('professor')}
                  className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    <span className="text-lg font-semibold">Login as Professor</span>
                  </div>
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Smart Analytics</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get detailed insights into attendance patterns with interactive charts and personalized analytics.
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Easy Tracking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Streamlined attendance marking system with date-wise tracking and student management.
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Multi-Role Access</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Separate dashboards for students and professors with role-specific features and permissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};