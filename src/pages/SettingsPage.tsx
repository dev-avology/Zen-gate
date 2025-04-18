/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import SettingsForm from '../components/SettingsForm';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    apiKey: '',
    apiSecret: '',
    surcharge: ''
  });
  const [error, setError] = useState('');
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the GHL location ID exists in localStorage
    const locationId = localStorage.getItem('ghl_location_id');
    
    if (!locationId) {
      // Redirect user to the OAuth or login page if not installed
      navigate('/oauth');
      return;
    }

    // Fetch configuration if installed
    api.get('/api/config')
      .then(res => {
        if (res.data) {
          setForm(res.data);
          setIsInstalled(true);  // Mark as installed if configuration exists
        }
      })
      .catch(err => {
        console.error('❌ Error fetching config', err);
        setIsInstalled(false);
      });
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    try {
      await api.post('/api/config', form);
      alert('✅ Settings saved successfully!');
    } catch (err: any) {
      console.error('❌ Error saving settings', err);
      setError(err?.response?.data?.message || err.message || 'Something went wrong');
    }
  };

  if (!isInstalled) {
    return (
      <div>
        <p>You need to complete the installation process before accessing the settings.</p>
        <button onClick={() => navigate('/oauth')}>Go to OAuth</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Payment Settings</h2>
      <SettingsForm form={form} onChange={handleChange} onSubmit={handleSubmit} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
