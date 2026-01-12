import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "@/lib/api/userController";
import { useUserAuth } from "@/context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function decodeJwtPayload(idToken: string): any | null {
  try {
    const parts = idToken.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const GoogleLoginButton: React.FC = () => {
  const { setToken } = useUserAuth();
  const navigate = useNavigate();

  return (
    <div className="flex justify-center ">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const idToken = credentialResponse.credential;
            if (!idToken) {
              toast.error("Google login failed. Try again.");
              return;
            }
            const payload = decodeJwtPayload(idToken);
            if (!payload) {
              toast.error("Invalid Google token");
              return;
            }
            const extractedName = (payload.name as string) || `${payload.given_name || ""} ${payload.family_name || ""}`.trim();
            const extractedEmail = payload.email as string | undefined;
            if (!extractedEmail) {
              toast.error("Google email not available");
              return;
            }
            const res = await googleLogin(extractedName || "Google User", extractedEmail);
            const token = res?.data?.token as string | undefined;
            if (token) {
              localStorage.setItem("va_user_token", token);
              setToken(token);
              toast.success("Successfully logged in with Google");
              navigate("/profile", { replace: true });
            } else {
              toast.error(res?.message || "Unable to login with Google");
            }
          } catch (err: any) {
            const msg = err?.response?.data?.message || "Google auth failed";
            toast.error(msg);
          }
        }}
        onError={() => toast.error("Google login failed")}
        useOneTap={false}
        locale="en"
      />
    </div>
  );
};

export default GoogleLoginButton;


