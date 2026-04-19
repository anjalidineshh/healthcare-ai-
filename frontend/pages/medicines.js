import React, { useEffect, useState } from 'react';
import { getApiClient } from '../utils/api';

const MedicinesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    medicineName: '',
    dosage: '',
    frequency: 'once',
    reminderTime: '09:00',
    reason: '',
  });

  const loadMedicines = async () => {
    const api = await getApiClient();
    const res = await api.get('/medicine/list');
    setItems(res.data?.reminders || []);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadMedicines();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const addMedicine = async (e) => {
    e.preventDefault();
    const api = await getApiClient();

    await api.post('/medicine/add', {
      medicineName: form.medicineName,
      dosage: form.dosage,
      frequency: form.frequency,
      reminderTimes: [form.reminderTime],
      reason: form.reason,
    });

    setForm({
      medicineName: '',
      dosage: '',
      frequency: 'once',
      reminderTime: '09:00',
      reason: '',
    });

    await loadMedicines();
  };

  const markTaken = async (item) => {
    const api = await getApiClient();
    await api.post('/medicine/log-adherence', {
      reminderId: item._id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: 'Taken from dashboard',
    });
    await loadMedicines();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Medicines</h1>
        <form onSubmit={addMedicine} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Medicine Name"
            value={form.medicineName}
            onChange={(e) => setForm({ ...form, medicineName: e.target.value })}
            required
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Dosage (e.g. 1 tablet)"
            value={form.dosage}
            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            required
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          >
            <option value="once">Once</option>
            <option value="twice">Twice</option>
            <option value="thrice">Thrice</option>
            <option value="custom">Custom</option>
          </select>
          <input
            type="time"
            className="border rounded-lg px-3 py-2"
            value={form.reminderTime}
            onChange={(e) => setForm({ ...form, reminderTime: e.target.value })}
          />
          <input
            className="border rounded-lg px-3 py-2 md:col-span-2"
            placeholder="Reason (optional)"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
          <button className="bg-healthcare-500 text-white rounded-lg px-4 py-2 md:col-span-2" type="submit">
            Add Medicine
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Active Reminders</h2>
        {loading ? <p>Loading...</p> : null}
        {!loading && items.length === 0 ? <p className="text-gray-600">No medicines yet.</p> : null}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-semibold">{item.medicineName}</p>
                <p className="text-sm text-gray-600">{item.dosage} • {item.frequency}</p>
                <p className="text-xs text-gray-500">Times: {(item.reminderTimes || []).join(', ')}</p>
              </div>
              <button
                className="bg-green-600 text-white rounded-lg px-3 py-2 text-sm"
                onClick={() => markTaken(item)}
              >
                Mark Taken
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicinesPage;
