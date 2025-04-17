import React, { useState } from 'react';
import { Settings2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Install from './components/Install';
import Credentials from './components/Credentials';

interface ProcessorConfig {
  mid: string;
  apiToken: string;
  isConnected: boolean;
}

function App() {
  const [acceptBlue, setAcceptBlue] = useState<ProcessorConfig>({
    mid: '',
    apiToken: '',
    isConnected: false
  });
  
  const [trx, setTrx] = useState<ProcessorConfig>({
    mid: '',
    apiToken: '',
    isConnected: false
  });

  const handleConnect = (processor: 'acceptBlue' | 'trx') => {
    if (processor === 'acceptBlue') {
      setAcceptBlue(prev => ({ ...prev, isConnected: true }));
    } else {
      setTrx(prev => ({ ...prev, isConnected: true }));
    }
  };

  const ProcessorCard = ({ 
    title, 
    processor, 
    config, 
    onChange 
  }: { 
    title: string;
    processor: 'acceptBlue' | 'trx';
    config: ProcessorConfig;
    onChange: (field: 'mid' | 'apiToken', value: string) => void;
  }) => (
    <div className="bg-bg-card rounded-lg shadow-lg p-6 mb-6 border border-olive/10 hover:border-olive/20 transition-colors">
      <div className="flex items-center mb-4">
        <CreditCard className="w-6 h-6 text-olive mr-2" />
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Merchant ID (MID)
          </label>
          <input
            type="text"
            value={config.mid}
            onChange={(e) => onChange('mid', e.target.value)}
            className="w-full px-4 py-2 border border-charcoal-light rounded-md focus:ring-2 focus:ring-olive/30 focus:border-transparent bg-bg-input text-text-primary placeholder-text-secondary/50"
            placeholder="Enter your Merchant ID"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            API Token
          </label>
          <input
            type="password"
            value={config.apiToken}
            onChange={(e) => onChange('apiToken', e.target.value)}
            className="w-full px-4 py-2 border border-charcoal-light rounded-md focus:ring-2 focus:ring-olive/30 focus:border-transparent bg-bg-input text-text-primary placeholder-text-secondary/50"
            placeholder="Enter your API Token"
          />
        </div>
        
        <button
          onClick={() => handleConnect(processor)}
          disabled={!config.mid || !config.apiToken || config.isConnected}
          className={`
            relative w-full py-3 px-4 rounded-md text-text-primary font-medium
            transition-all duration-200 overflow-hidden
            ${config.isConnected
              ? 'bg-gradient-to-br from-olive/60 to-olive/40 cursor-not-allowed shadow-inner'
              : !config.mid || !config.apiToken
                ? 'bg-charcoal-light cursor-not-allowed'
                : `
                    bg-gradient-to-br from-olive-light to-olive
                    hover:from-olive hover:to-olive-dark
                    active:scale-[0.98]
                    shadow-[0_4px_0_0_rgba(74,74,43,0.8)]
                    active:shadow-[0_0_0_0_rgba(74,74,43,0.8)]
                    active:translate-y-1
                    after:absolute after:inset-0 after:bg-gradient-to-t
                    after:from-black/10 after:to-transparent
                  `
            }
          `}
        >
          {config.isConnected ? (
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Connected
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Settings2 className="w-5 h-5 mr-2" />
              Connect
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Install />} />
        <Route path="/credentials" element={<Credentials />} />
      </Routes>
    </Router>
  );
}

export default App;