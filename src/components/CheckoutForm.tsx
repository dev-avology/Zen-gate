import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    HostedTokenization?: any;
  }
}

export default function CheckoutIframePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isGhlReady, setIsGhlReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tokenizationRef = useRef<any>(null);
  const scriptLoaded = useRef(false);

  const locationId = localStorage.getItem("location_id");
  console.log('locationId',locationId);
  useEffect(() => {
    if (!locationId) {
      navigate("/settings");
      return;
    }

    setIsGhlReady(true);

    const initTokenization = async () => {
      try {
        if (!scriptLoaded.current) {
          await loadHostedTokenizationScript();
          scriptLoaded.current = true;
        }

        const tokenizationSourceKey = import.meta.env
          .VITE_TOKENIZATION_SOURCE_KEY; // Replace with your actual public key
        const options = {
          target: "#card-form",
          style: {
            base: {
              fontSize: "16px",
              color: "#ffffff",
              backgroundColor: "#2C2C2C",
              fontFamily: "Inter, sans-serif",
              "::placeholder": {
                color: "#888888",
              },
            },
            invalid: {
              color: "#ff4d4f",
            },
          },
        };

        if (!tokenizationRef.current && window.HostedTokenization) {
          tokenizationRef.current = new window.HostedTokenization(
            tokenizationSourceKey,
            options
          );
        }
      } catch (err) {
        toast.error("❌ Failed to load payment script");
        console.error(err);
      }
    };

    initTokenization();

    return () => {
      const container = document.getElementById("card-form");
      if (container) container.innerHTML = "";
      tokenizationRef.current = null;
    };
  }, [navigate]);

  const loadHostedTokenizationScript = () => {
    return new Promise<void>((resolve, reject) => {
      const scriptId = "acceptblue-tokenization-script";
      if (document.getElementById(scriptId)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = scriptId;
      script.src = import.meta.env.VITE_TOKENIZATION_GATEWAY; // sandbox URL
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("❌ Failed to load Accept Blue script"));
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (!tokenizationRef.current) {
        throw new Error("Tokenization not initialized");
      }

      const result = await tokenizationRef.current.getNonceToken();
      console.log(result, "result");
      const nonceToken = result.nonce;
      const cardType = result.cardType;
      const expiryMonth = result.expiryMonth;
      const expiryYear = result.expiryYear;
      const last4 = result.last4;
      console.log("nonceToken", nonceToken);

      const response = await api.post(
        "/charge",
        {
          token: nonceToken,
          amount: 200, // e.g., $2.00 in cents
          description: "Test transaction",
          surcharge: 100, // or true depending on your logic
          location_id: locationId,
          cardType : cardType,
          expiryMonth : expiryMonth,
          expiryYear : expiryYear,
          last4 : last4,
          name : 'Test Name'
        },
        {
          headers: {
            "X-Location-Id": locationId,
          },
        }
      );

      console.log(response);

      toast.success("✅ Payment Successful");
      navigate("/success"); // Optional: redirect on success
    } catch (err: any) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err.message ||
        "❌ Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#1E1E1E] text-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-1">
          Payment Gateway Integration
        </h2>
        <p className="text-gray-400 mb-6">
          Connect your payment process to complete the setup
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Card Details</label>
          <div
            id="card-form"
            className="bg-[#2C2C2C] p-4 rounded-md border border-gray-700 flex items-center justify-center h-[93px]"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-2 rounded-md font-medium flex items-center justify-center text-white ${
            isLoading
              ? "bg-gray-600"
              : "bg-gradient-to-r from-[#8C8C5C] to-[#A2A264] hover:opacity-90"
          }`}
        >
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Pay Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
