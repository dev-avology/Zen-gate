/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    HostedTokenization?: any;
  }
}

export default function CheckoutForm() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isGhlReady, setIsGhlReady] = useState(false);  // State to check GHL authentication
  const tokenizationRef = useRef<any>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    const locationId = localStorage.getItem('location_id');
    
    // If no location ID is found, redirect the user to the settings or OAuth page
    if (!locationId) {
      navigate('/settings'); // Or redirect to the page where they connect GHL
      return;
    }

    setIsGhlReady(true); // Proceed if GHL location ID is found

    const loadScriptAndInit = async () => {
      if (!scriptLoaded.current) {
        await loadHostedTokenizationScript();
        scriptLoaded.current = true;
      }

      const tokenizationSourceKey = 'pk_abc123'; // Replace with your actual Accept Blue public key
      const options = { target: '#my-div' };

      if (!tokenizationRef.current && window.HostedTokenization) {
        tokenizationRef.current = new window.HostedTokenization(tokenizationSourceKey, options);
      }
    };

    loadScriptAndInit();

    return () => {
      const container = document.getElementById('my-div');
      if (container) container.innerHTML = ''; // Clean up container
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
      script.src = 'https://tokenization.sandbox.tracerpaygateway.com/tokenization/v0.3';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Accept Blue script'));
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    setError('');
    try {
      if (!tokenizationRef.current) throw new Error('Tokenization not initialized');

      const result = await tokenizationRef.current.getNonceToken();
      const nonceToken = result.token;

      const res = await api.post('/api/charge', {
        token: nonceToken,
        amount: 1000,
        description: 'Test transaction',
      });
      
      console.log(res);

      alert('✅ Payment Successful');
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err?.response?.data?.message || err.message || 'Something went wrong');
    }
  };

  if (!isGhlReady) {
    return <p>Loading... or you need to log in to GHL first.</p>;  // Optionally, show a loading spinner or message
  }

  return (
    <div>
      <h2>Checkout</h2>
      {/* <div id="my-div" /> */}
      <button onClick={handleSubmit}>Pay</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <iframe
        src="https://phpstack-1180784-5431682.cloudwaysapps.com/webhook/payment-page"
        title="Payment Page"
        style={{ width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
      ></iframe>
    </div>
  );
}
