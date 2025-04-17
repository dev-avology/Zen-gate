import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Install: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  const handleInstall = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/integrations/oauth/callback`, {
        method: 'POST',
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok || data.status !== 'success') {
        const errorMessage = data.message || 'Something went wrong!';
        const errorDetails = data.details?.error_description || '';
        toast.error(`${errorMessage}${errorDetails ? ` - ${errorDetails}` : ''}`);
        return;
      }

      if (data.status === 'success') {
        const user_id = data.data.id;
        // Store user_id in localStorage
        localStorage.setItem('user_id', user_id);
        navigate('/credentials');
      } else {
        throw new Error(data.message || 'Failed to fetch reps');
      }
    } catch (error) {
      console.error('Error fetching reps:', error);
      toast.error('Something went wrong!')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-text-primary flex items-center justify-center">
      <div className="bg-bg-card rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Settings2 className="w-16 h-16 text-olive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Install Zen Gate
          </h1>
          <p className="text-text-secondary">
            Click the button below to install and configure your payment gateway
          </p>
        </div>

        <button
          onClick={handleInstall}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-md text-text-primary font-medium
    bg-gradient-to-br from-olive-light to-olive
    hover:from-olive hover:to-olive-dark
    active:scale-[0.98]
    shadow-[0_4px_0_0_rgba(74,74,43,0.8)]
    active:shadow-[0_0_0_0_rgba(74,74,43,0.8)]
    active:translate-y-1
    transition-all duration-200
    relative overflow-hidden
    after:absolute after:inset-0 after:bg-gradient-to-t
    after:from-black/10 after:to-transparent
    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
  `}
        >
          <div className="flex items-center justify-center">
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Settings2 className="w-5 h-5 mr-2" />
                Install App
              </>
            )}
          </div>
        </button>

      </div>
    </div>
  );
};

export default Install; 