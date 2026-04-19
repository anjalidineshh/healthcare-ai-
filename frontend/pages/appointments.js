import React, { useEffect, useState } from 'react';
import { getApiClient } from '../utils/api';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    doctorName: '',
    specialty: '',
    clinicName: '',
    appointmentDate: '',
    notes: '',
  });

  const loadAppointments = async () => {
    const api = await getApiClient();
    const res = await api.get('/appointments/list');
    setAppointments(res.data?.appointments || []);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const bookAppointment = async (e) => {
    e.preventDefault();
    const api = await getApiClient();
    await api.post('/appointments/book', {
      ...form,
      duration: 30,
    });
    setForm({
      doctorName: '',
      specialty: '',
      clinicName: '',
      appointmentDate: '',
      notes: '',
    });
    await loadAppointments();
  };

  const confirmAppointment = async (id) => {
    const api = await getApiClient();
    await api.post(`/appointments/${id}/confirm`);
    await loadAppointments();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Appointments</h1>
        <form onSubmit={bookAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded-lg px-3 py-2" placeholder="Doctor Name" value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} required />
          <input className="border rounded-lg px-3 py-2" placeholder="Specialty" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" placeholder="Clinic Name" value={form.clinicName} onChange={(e) => setForm({ ...form, clinicName: e.target.value })} />
          <input type="datetime-local" className="border rounded-lg px-3 py-2" value={form.appointmentDate} onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })} required />
          <input className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button className="bg-healthcare-500 text-white rounded-lg px-4 py-2 md:col-span-2" type="submit">Book Appointment</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Appointments</h2>
        {appointments.length === 0 ? <p className="text-gray-600">No appointments yet.</p> : null}
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt._id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-semibold">Dr. {appt.doctorName}</p>
                <p className="text-sm text-gray-600">{appt.specialty || 'General'} • {appt.clinicName || 'Clinic not set'}</p>
                <p className="text-xs text-gray-500">{new Date(appt.appointmentDate).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{appt.status}</span>
                {appt.status !== 'confirmed' ? (
                  <button className="bg-green-600 text-white rounded-lg px-3 py-2 text-sm" onClick={() => confirmAppointment(appt._id)}>
                    Confirm
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
