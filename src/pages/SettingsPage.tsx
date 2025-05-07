import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import SettingsForm from "../components/SettingsForm";

// 👇 Function to get user data from parent context
async function getUserData() {
  try {
    const encryptedUserData = await new Promise((resolve) => {
      window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");

      const messageHandler = ({ data }: MessageEvent) => {
        if (data.message === "REQUEST_USER_DATA_RESPONSE") {
          window.removeEventListener("message", messageHandler);
          resolve(data.payload); // <-- This is encrypted data
        }
      };

      window.addEventListener("message", messageHandler);
    });

    console.log("Encrypted Data:", encryptedUserData);  // Log encrypted data

    // try {
      const res = await api.post("/api/decrypt-data", {
        encrypted_data: encryptedUserData,
      });

      if (res.data) {
        console.log("✅ Decrypted Data:", res.data);
        return res.data;
      }
    // } catch (err) {
    //   console.error("❌ Error decrypting user data", err);
    // }

    return encryptedUserData;  // Return the encrypted data
  } catch (error) {
    console.error("Failed to fetch user data:", error);
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
        console.log("🗃 Initial localStorage location_id:", storedLocationId);
        setIsInstalled(true);
        fetchConfig(storedLocationId);
        return;
      }
  
      if (window.self !== window.top) {
        console.log("🖼 Inside iframe, requesting encrypted context...");
        try {
          const encryptedData = await getUserData();
          console.log("Encrypted Data:", encryptedData); // 👈 This will show encrypted data
        } catch (err) {
          console.error("❌ Failed to fetch encrypted user data", err);
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
      alert("✅ Settings saved successfully!");
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
