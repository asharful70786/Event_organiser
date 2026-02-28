import { useEffect, useState } from "react";
import AdminKeyModal from "./AdminKeyModal";
import { validateAdminKey } from "../../api/adminApi";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
        const checkStoredKey = async () => {
      const storedKey = localStorage.getItem("adminKey");
      if (!storedKey) {
        setChecking(false);
        return;
      }

      try {
        await validateAdminKey(storedKey);
        setAuthorized(true);
      } catch {
        localStorage.removeItem("adminKey");
      } finally {
        setChecking(false);
      }
    };

    checkStoredKey();
  }, []);

  if (checking) {
    return <div className="p-6">Checking access...</div>;
  }

  if (!authorized) {
    return <AdminKeyModal onSuccess={() => setAuthorized(true)} />;
  }

  return (
    <div className="p-6">
      
     <AdminDashboard onUnauthorized={() => setAuthorized(false)} />
    </div>
  );
}