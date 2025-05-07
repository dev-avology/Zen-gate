import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import SettingsForm from "../components/SettingsForm";
import { toast, Toaster } from 'react-hot-toast';

// Request encrypted user data from parent frame and decrypt it
async function getUserData() {
  try {
    const encryptedUserData = await new Promise<string>((resolve) => {
      window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");

      const messageHandler = ({ data }: MessageEvent) => {
        if (data.message === "REQUEST_USER_DATA_RESPONSE") {
          window.removeEventListener("message", messageHandler);
          resolve(data.payload); // Encrypted string
        }
      };

      window.addEventListener("message", messageHandler);
    });

     // Send encrypted data to your backend for decryption
     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/decrypt-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ encrypted_data: encryptedUserData })
    })
    console.log('encryptedUserData',encryptedUserData);
    const userData = await response.json()
    console.log(userData);

    console.log("🔐 Received Encrypted Data:", userData);


    return userData;
  } catch (error) {
    console.error("❌ Failed to get or decrypt user data:", error);
    throw error;
  }
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    apiKey: "",
    apiSecret: "",
    surcharge: "",
  });
  const [error, setError] = useState("");
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConfig = async (locationId: string) => {
    console.log("📡 Fetching config for location_id:", locationId);
    try {
      const res = await api.get("/api/config", {
        headers: { "X-Location-Id": locationId },
      });
      if (res.data) {
        setForm(res.data);
        setIsInstalled(true);
      }
    } catch (err) {
      console.error("❌ Error fetching config", err);
      setIsInstalled(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const storedLocationId = localStorage.getItem("location_id");
      if (storedLocationId) {
        console.log("🗃 LocalStorage location_id:", storedLocationId);
        setIsInstalled(true);
        fetchConfig(storedLocationId);
        return;
      }

      if (window.self !== window.top) {
        console.log("🖼 Inside iframe, requesting context...");
        try {
          const userData = await getUserData();

          if (userData?.activeLocation) {
            localStorage.setItem("location_id", userData.activeLocation);
            fetchConfig(userData.fetchConfig);
            setIsInstalled(true);
          } else {
            console.warn("⚠️ No location_id found in decrypted user data");
          }
        } catch (err) {
          console.error("❌ Failed to process user data", err);
        }
      } else {
        console.log("🌐 Not inside iframe. Manual auth might be needed.");
      }
    };

    init();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);
    const locationId = localStorage.getItem("location_id");
    try {
      await api.post("/api/config-save", form, {
        headers: { "X-Location-Id": locationId },
      });
      toast.success("✅ Settings saved successfully!");
    } catch (err: any) {
      console.error("❌ Error saving settings", err);
      if (err?.response?.status === 422 && err?.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors)
          .flat()
          .join(" ");
        setError(messages);
      } else {
        setError(
          err?.response?.data?.message || err.message || "Something went wrong"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInstalled) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-medium mb-4">
          You need to complete the installation process before accessing the
          settings.
        </p>
        <button
          onClick={() => navigate("/oauth")}
          className="px-6 py-2 bg-olive text-white rounded-md hover:bg-olive-dark transition"
        >
          Go to OAuth
        </button>
      </div>
    );
  }

  return (
    <div>
      <SettingsForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
