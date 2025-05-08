import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    HostedTokenization?: any;
  }
}

export default function CheckoutIframePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isGhlReady, setIsGhlReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tokenizationRef = useRef<any>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    const locationId = localStorage.getItem('location_id');

    if (!locationId) {
      navigate('/settings');
      return;
    }

    setIsGhlReady(true);

    const loadScriptAndInit = async () => {
      if (!scriptLoaded.current) {
        await loadHostedTokenizationScript();
        scriptLoaded.current = true;
      }

      const tokenizationSourceKey = 'pk_abc123'; // Replace with your actual key
      const options = { target: '#card-form' };

      if (!tokenizationRef.current && window.HostedTokenization) {
        tokenizationRef.current = new window.HostedTokenization(tokenizationSourceKey, options);
      }
    };

    loadScriptAndInit();

    return () => {
      const container = document.getElementById('card-form');
      if (container) container.innerHTML = '';
      tokenizationRef.current = null;
    };
  }, [navigate]);

  const loadHostedTokenizationScript = () => {
    return new Promise<void>((resolve, reject) => {
      const scriptId = 'acceptblue-tokenization-script';
      if (document.getElementById(scriptId)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://tokenization.sandbox.tracerpaygateway.com/tokenization/v0.3'; // Use live URL if needed
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('❌ Failed to load Accept Blue script'));
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      if (!tokenizationRef.current) throw new Error('Tokenization not initialized');

      const result = await tokenizationRef.current.getNonceToken();
      const nonceToken = result.token;

      const response = await api.post('/api/charge', {
        token: nonceToken,
        amount: 1000,
        description: 'Test transaction',
      });

      toast.success('✅ Payment Successful');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isGhlReady) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Loading... Please connect to GHL first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Secure Checkout</h2>
      <div id="card-form" className="border p-4 rounded-md mb-4" />

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md text-white transition ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}
