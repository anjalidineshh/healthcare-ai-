import React, { useEffect, useState } from 'react';
import { getApiClient } from '../utils/api';

const ProfilePage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    bloodType: '',
    language: 'en',
    voiceEnabled: true,
  });
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const api = await getApiClient();
      const res = await api.get('/auth/profile');
      const user = res.data?.user || {};

      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        age: user.healthProfile?.age || '',
        bloodType: user.healthProfile?.bloodType || '',
        language: user.language || 'en',
        voiceEnabled: user.voiceEnabled ?? true,
      });
    };

    load();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    const api = await getApiClient();

    await api.patch('/auth/profile', {
      firstName: form.firstName,
      lastName: form.lastName,
      language: form.language,
      voiceEnabled: form.voiceEnabled,
      healthProfile: {
        age: form.age ? Number(form.age) : undefined,
        bloodType: form.bloodType,
      },
    });

    setSavedMessage('Profile saved successfully.');
    setTimeout(() => setSavedMessage(''), 2500);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
      <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border rounded-lg px-3 py-2" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <input className="border rounded-lg px-3 py-2" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <input className="border rounded-lg px-3 py-2" type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        <input className="border rounded-lg px-3 py-2" placeholder="Blood Type" value={form.bloodType} onChange={(e) => setForm({ ...form, bloodType: e.target.value })} />
        <select className="border rounded-lg px-3 py-2" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ml">Malayalam</option>
        </select>
        <label className="border rounded-lg px-3 py-2 flex items-center gap-2">
          <input type="checkbox" checked={form.voiceEnabled} onChange={(e) => setForm({ ...form, voiceEnabled: e.target.checked })} />
          Voice Enabled
        </label>
        <button className="bg-healthcare-500 text-white rounded-lg px-4 py-2 md:col-span-2" type="submit">Save Profile</button>
      </form>
      {savedMessage ? <p className="text-green-600 text-sm mt-3">{savedMessage}</p> : null}
    </div>
  );
};

export default ProfilePage;
