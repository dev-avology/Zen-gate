import React from 'react';
import { CreditCard, Settings2 } from 'lucide-react';

interface SettingsFormProps {
  form: { apiKey: string; apiSecret: string; surcharge: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  form,
  onChange,
  onSubmit,
  isLoading,
  error,
}) => {
  return (
    <div className="min-h-screen bg-charcoal text-text-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-bg-card rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-2xl font-bold mb-2">Payment Gateway Integration</h1>
            <p className="text-text-secondary mb-6">
              Connect your payment process to complete the setup
            </p>
          </div>

          <div className="bg-bg-card rounded-lg shadow-lg p-6 mb-6 border border-olive/10 hover:border-olive/20 transition-colors">
            <div className="flex items-center mb-4">
              <CreditCard className="w-6 h-6 text-olive mr-2" />
              <h2 className="text-xl font-semibold">User Setting</h2>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  API Key
                </label>
                <input
                  name="apiKey"
                  value={form.apiKey}
                  onChange={onChange}
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-charcoal-light rounded-md focus:ring-2 focus:ring-olive/30 bg-bg-input text-text-primary"
                  placeholder="Enter your Merchant ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  API Secret
                </label>
                <input
                  name="apiSecret"
                  value={form.apiSecret}
                  onChange={onChange}
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-charcoal-light rounded-md focus:ring-2 focus:ring-olive/30 bg-bg-input text-text-primary"
                  placeholder="Enter your API Token"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Surcharge (%)
                </label>
                <input
                  name="surcharge"
                  value={form.surcharge}
                  onChange={onChange}
                  type="number"
                  required
                  className="w-full px-4 py-2 border border-charcoal-light rounded-md focus:ring-2 focus:ring-olive/30 bg-bg-input text-text-primary"
                  placeholder="e.g. 5.00"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

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
                    Save
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

export default SettingsForm;
