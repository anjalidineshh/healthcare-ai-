/**
 * Dashboard Page
 * Location: frontend/pages/dashboard.js
 */

import React, { useState, useEffect } from 'react';
import { Heart, Pill, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: { Authorization: `Bearer ${token}` },
      });

      const [userRes, medicinesRes, appointmentsRes, notificationsRes] =
        await Promise.all([
          api.get('/auth/profile'),
          api.get('/medicine/list'),
          api.get('/appointments/list'),
          api.get('/notifications'),
        ]);

      setUser(userRes.data.user);
      setMedicines(medicinesRes.data.reminders || []);
      setAppointments(appointmentsRes.data.appointments || []);
      setNotifications(notificationsRes.data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-healthcare-200 border-t-healthcare-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-healthcare-500 to-healthcare-600 rounded-2xl p-8 text-white shadow-healthcare">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {user?.firstName || 'User'}!
        </h1>
        <p className="text-healthcare-100">
          Your health companion is here to support you
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-healthcare-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Medicines</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {medicines.length}
              </p>
            </div>
            <Pill className="text-healthcare-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Upcoming Appointments
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {appointments.filter((a) => a.status === 'scheduled').length}
              </p>
            </div>
            <Calendar className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Notifications</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {notifications.filter((n) => !n.read).length}
              </p>
            </div>
            <AlertCircle className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Health Profile</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {user?.healthProfile?.age ? `${user.healthProfile.age}y` : 'N/A'}
              </p>
            </div>
            <Heart className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Medicines */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Active Medicines
            </h2>

            {medicines.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill size={48} className="mx-auto mb-4 opacity-30" />
                <p>No medicines tracked yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {medicines.slice(0, 5).map((medicine) => (
                  <div
                    key={medicine._id}
                    className="flex items-center justify-between p-4 bg-healthcare-50 rounded-lg border border-healthcare-200 hover:border-healthcare-400 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {medicine.medicineName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {medicine.dosage} • {medicine.frequency}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {medicine.reminderTimes.map((time, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-healthcare-200 text-healthcare-800 px-2 py-1 rounded"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {medicine.adherence?.length || 0} days logged
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {medicine.adherence
                          ? Math.round(
                              (medicine.adherence.filter((a) => a.taken).length /
                                medicine.adherence.length) *
                                100
                            ) || 0
                          : 0}
                        % adherence
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Appointments
            </h2>

            {appointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                <p>No appointments scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt._id}
                    className="p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <p className="font-semibold text-gray-800">
                      Dr. {apt.doctorName}
                    </p>
                    <p className="text-sm text-gray-600">{apt.specialty}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(apt.appointmentDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 bg-green-200 text-green-800 rounded">
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Notifications
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.slice(0, 5).map((notif) => (
              <div
                key={notif._id}
                className={`p-4 rounded-lg border-l-4 ${
                  notif.read
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-healthcare-50 border-healthcare-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{notif.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      notif.priority === 'high'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {notif.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
