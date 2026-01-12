import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "@/context/AuthContext"; 
import { UserAuthProvider } from "@/context/UserAuthContext"; 
import { NotificationProvider } from "@/context/NotificationContext";
import NotificationListener from "@/components/NotificationListener";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    {/* 🔥 Step 1: UserAuthProvider must wrap everything */}
    <UserAuthProvider>

      {/* 🔥 Step 2: Admin Auth Provider */}
      <AuthProvider>

        {/* 🔥 Step 3: Notification Context */}
        <NotificationProvider>

          {/* 🔥 Step 4: Now NotificationListener will work */}
          <NotificationListener />

          {/* App */}
          <App />

        </NotificationProvider>
      </AuthProvider>
    </UserAuthProvider>
  </GoogleOAuthProvider>
);
