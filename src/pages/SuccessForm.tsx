import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessForm: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white px-4">
      <div className="bg-[#1e1e1e] rounded-2xl p-8 shadow-lg w-full max-w-md text-center">
        <CheckCircle className="mx-auto text-[#b0b06f] w-16 h-16 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Payment Successful</h2>
        <p className="text-sm text-gray-400 mb-6">
          Your transaction has been completed successfully. Thank you for your payment.
        </p>
        <button
          className="bg-[#b0b06f] hover:bg-[#a0a05f] text-black font-medium py-2 px-6 rounded-md transition-colors duration-300"
          onClick={() => window.location.href = '/'}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessForm;
