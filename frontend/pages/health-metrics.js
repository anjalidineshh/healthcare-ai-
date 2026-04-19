import React, { useEffect, useState } from 'react';
import { getApiClient } from '../utils/api';

const METRIC_OPTIONS = [
  { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm' },
  { value: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL' },
  { value: 'temperature', label: 'Temperature', unit: 'C' },
  { value: 'weight', label: 'Weight', unit: 'kg' },
  { value: 'sleep_hours', label: 'Sleep Hours', unit: 'hours' },
];

const HealthMetricsPage = () => {
  const [metricType, setMetricType] = useState('heart_rate');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [records, setRecords] = useState([]);

  const loadMetrics = async (type = metricType) => {
    const api = await getApiClient();
    const res = await api.get(`/health/metrics/${type}`);
    setRecords(res.data?.metrics || []);
  };

  useEffect(() => {
    loadMetrics(metricType);
  }, [metricType]);

  const addMetric = async (e) => {
    e.preventDefault();
    const api = await getApiClient();
    const selected = METRIC_OPTIONS.find((m) => m.value === metricType);

    await api.post('/health/metric', {
      metricType,
      value: Number(value),
      unit: selected?.unit || '',
      notes,
    });

    setValue('');
    setNotes('');
    await loadMetrics(metricType);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Health Metrics</h1>
        <form onSubmit={addMetric} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select className="border rounded-lg px-3 py-2" value={metricType} onChange={(e) => setMetricType(e.target.value)}>
            {METRIC_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input className="border rounded-lg px-3 py-2" type="number" step="0.1" placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} required />
          <input className="border rounded-lg px-3 py-2" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button className="bg-healthcare-500 text-white rounded-lg px-4 py-2" type="submit">Add Metric</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Recent Records</h2>
        {records.length === 0 ? <p className="text-gray-600">No metrics yet.</p> : null}
        <div className="space-y-3">
          {records.map((row) => (
            <div key={row._id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{row.value} {row.unit}</p>
                <p className="text-sm text-gray-600">{row.notes || 'No notes'}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs ${row.isAbnormal ? 'text-red-600' : 'text-green-600'}`}>
                  {row.isAbnormal ? 'Abnormal' : 'Normal'}
                </p>
                <p className="text-xs text-gray-500">{new Date(row.recordedAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthMetricsPage;
