import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { adminGetProfile, AdminProfileData } from "@/lib/api/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AdminProfile = () => {
  const { token, name, email } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await adminGetProfile(token);
        setProfile(data);
      } catch (err) {
        setError((err as Error).message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  const display =
    profile ||
    ({
      id: 0,
      user_code: "-",
      name: name || "Admin",
      email: email || "-",
      last_login_at: null,
      current_token_expires_at: null,
      email_verified_at: null,
      two_factor_verified: 0,
      created_at: "",
      updated_at: "",
      role: "admin",
      fcm_token: null,
      status: 1,
      two_factor_code: null,
      two_factor_expires_at: null,
      mobile: null,
      mobile_otp_expires_at: null,
      mobile_verified_at: null,
    } as AdminProfileData);

  const initial = (display.name || "A").charAt(0).toUpperCase();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Profile</h1>
          <p className="text-sm text-muted-foreground">
            View your account details
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="leading-tight">{display.name}</CardTitle>
            <CardDescription className="leading-tight">
              {display.email}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          )}
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="User Code" value={display.user_code} />
              <Field label="Role" value={display.role} />
              <Field label="Status" value={display.status ? "Active" : "Inactive"} />
              <Field
                label="Two Factor Verified"
                value={String(display.two_factor_verified)}
              />
              <Field label="Last Login" value={display.last_login_at || "-"} />
              <Field
                label="Token Expires"
                value={display.current_token_expires_at || "-"}
              />
              <Field
                label="Email Verified"
                value={display.email_verified_at || "-"}
              />
              <Field label="Mobile" value={display.mobile || "-"} />
              <Field label="Created At" value={display.created_at || "-"} />
              <Field label="Updated At" value={display.updated_at || "-"} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1 rounded border p-3">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-sm font-medium break-words">{value}</div>
  </div>
);

export default AdminProfile;
