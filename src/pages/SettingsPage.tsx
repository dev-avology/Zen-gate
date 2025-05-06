import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import SettingsForm from "../components/SettingsForm";

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
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);

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

  const handleMessage = (event: MessageEvent) => {
    console.log("📥 Message received:", event.data);

    if (typeof event.data !== "object") return;

    try {
      const { location_id } = event.data || {};
      if (!location_id) return;

      console.log("✅ Received location_id:", location_id);

      const storedLocationId = localStorage.getItem("location_id");
      if (storedLocationId !== location_id) {
        localStorage.setItem("location_id", location_id);
        console.log("📦 location_id stored in localStorage:", location_id);
        fetchConfig(location_id);
      } else {
        console.log("🟢 location_id unchanged. Skipping fetch.");
      }

      setIsInstalled(true);

      // Send back confirmation to parent
      if (iframeRef) {
        iframeRef.contentWindow?.postMessage({ received: true }, "*");
      }
    } catch (err) {
      console.error("❌ Error processing location_id message:", err);
    }
  };

  useEffect(() => {
    const storedLocationId = localStorage.getItem("location_id");
    console.log("🗃 Initial localStorage location_id:", storedLocationId);

    if (storedLocationId) {
      setIsInstalled(true);
      fetchConfig(storedLocationId);
    }

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const storedLocationId = localStorage.getItem("location_id");
    if (iframeRef && storedLocationId) {
      console.log(iframeRef,'iframeRef');
      console.log("📤 Sending location_id to iframe:", storedLocationId);
      iframeRef.contentWindow?.postMessage({ location_id: storedLocationId }, "*");
    }
  }, [iframeRef]);

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
        const messages = Object.values(err.response.data.errors).flat().join(" ");
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
          You need to complete the installation process before accessing the settings.
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

      <iframe
        ref={setIframeRef}
        src="https://your-marketplace-url.com"
        title="Marketplace"
        width="100%"
        height="800px"
      />
    </div>
  );
}
