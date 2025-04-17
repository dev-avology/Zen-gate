import React, { useState } from 'react';
import { CreditCard, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Credentials: React.FC = () => {

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const form = event.currentTarget;
    const mid = (document.getElementById('mid') as HTMLInputElement).value.trim();
    const apiToken = (document.getElementById('apiToken') as HTMLInputElement).value.trim();
    const userId = localStorage.getItem('user_id') ?? '';
  
    if (!mid) {
      toast.error("Merchant ID is required!");
      return;
    }
    if (!apiToken) {
      toast.error("API Token is required!");
      return;
    }
  
    try {
      setIsLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/add-merchant`, {
        method: 'POST',
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          merchant_id : mid,
          api_token : apiToken,
          user_id : userId
         }),
      });
  
      const result = await response.json();

      console.log(result,'result');
  
      if (!response.ok) {
        if (response.status === 422) {
          const validationErrors = result.errors || {};
          setErrors(validationErrors);
  
          Object.values(validationErrors).forEach((fieldErrors: string[] | any) => {
            fieldErrors.forEach((msg: string) => toast.error(msg));
          });
  
        } else {
          throw new Error(result.message || 'Form submission failed');
        }
        return;
      }
  
      console.log('Response from server:', result);
      toast.success("Credentials submitted successfully.");
      form.reset();
      setErrors({});

    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong while submitting credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-charcoal text-text-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-bg-card rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-2xl font-bold mb-2">Payment Gateway Integration</h1>
            <p className="text-text-secondary mb-6">
              Connect your payment processors to complete the setup
            </p>
          </div>

          <div className="bg-bg-card rounded-lg shadow-lg p-6 mb-6 border border-olive/10 hover:border-olive/20 transition-colors">
            <div className="flex items-center mb-4">
              <CreditCard className="w-6 h-6 text-olive mr-2" />
              <h2 className="text-xl font-semibold">Accept Blue Integration</h2>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Merchant ID (MID)
                </label>
                <input
                  id="mid"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-charcoal-light rounded-md focus:ring-2 focus:ring-olive/30 focus:border-transparent bg-bg-input text-text-primary placeholder-text-secondary/50"
                  placeholder="Enter your Merchant ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  API Token
                </label>
                <input
                  id="apiToken"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-charcoal-light rounded-md focus:ring-2 focus:ring-olive/30 focus:border-transparent bg-bg-input text-text-primary placeholder-text-secondary/50"
                  placeholder="Enter your API Token"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`relative w-full py-3 px-4 rounded-md font-medium transition-all duration-200 overflow-hidden
    ${isLoading ? 'bg-olive cursor-not-allowed opacity-70' : 'bg-gradient-to-br from-olive-light to-olive hover:from-olive hover:to-olive-dark'}
    active:scale-[0.98] shadow-[0_4px_0_0_rgba(74,74,43,0.8)] active:shadow-[0_0_0_0_rgba(74,74,43,0.8)] active:translate-y-1`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Settings2 className="w-5 h-5 mr-2" />
                    Connect
                  </div>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credentials;
