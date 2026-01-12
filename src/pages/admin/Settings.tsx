import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Save,
  Upload,
  Shield,
  Database,
  Palette,
  Globe,
  Mail,
  CreditCard,
  Loader2,
  Settings as SettingsIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getSettings,
  updateGeneralSettings,
  updateBusinessSettings,
  updatePaymentSettings,
  updateInventorySettings,
  updateSecuritySettings,
  updateGoldApiSettings,
} from "@/lib/api/settingController";
import { useAuth } from "@/context/AuthContext";

interface SettingsData {
  general: {
    site_name: string;
    currency: string;
    site_description: string;
    timezone: string;
    default_language: string;
    maintenance_mode: boolean;
  };
  business_information: {
    company_name: string;
    "Business Address": string;
    company_email: string;
    company_phone: string;
    gst_number: string;
    pan_number: string;
  };
  payment_methods: {
    razorpay_enabled: boolean;
    cod_enabled: boolean;
    emi_enabled: boolean;
    digital_wallet_enabled: boolean;
    razorpay_key_id: string;
    razorpay_secret: string;
  };
  inventory_management: {
    low_stock_alert_threshold: number;
    auto_reorder_level: number;
    auto_reorder: boolean;
    serial_number_tracking: boolean;
    barcode_system: boolean;
  };
  security_settings: {
    two_factor_authentication: boolean;
    audit_logging: boolean;
    session_timeout_minutes: number;
    password_policy: {
      min_length: number;
      require_uppercase: boolean;
      require_lowercase: boolean;
      require_number: boolean;
      require_special_character: boolean;
    };
  };
  gold_api_settings: {
    api_key: string;
    base_url: string;
    currency: string;
  };
}

const Settings = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [goldApiModalOpen, setGoldApiModalOpen] = useState(false);
  // Inside your component:
const [showKey, setShowKey] = useState(false);
const [showSecret, setShowSecret] = useState(false);
  const [goldApiForm, setGoldApiForm] = useState({
    api_key: "",
    base_url: "",
    currency: "",
  });

  const openGoldApiModal = () => {
    if (settings?.gold_api_settings) {
      setGoldApiForm({
        api_key: settings.gold_api_settings.api_key,
        base_url: settings.gold_api_settings.base_url,
        currency: settings.gold_api_settings.currency,
      });
    }
    setGoldApiModalOpen(true);
  };

  const handleGoldApiSave = async () => {
    if (!token || !settings) return;

    try {
      setSaving(true);
      await updateGoldApiSettings(token, goldApiForm);

      // Update local state
      setSettings({
        ...settings,
        gold_api_settings: goldApiForm,
      });

      setGoldApiModalOpen(false);
      toast({
        title: "Gold API Settings Saved",
        description: "Gold API settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving gold API settings:", error);
      toast({
        title: "Error",
        description: "Failed to save Gold API settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (section: string) => {
    if (!token || !settings) return;

    try {
      setSaving(true);

      switch (section.toLowerCase()) {
        case "general":
          await updateGeneralSettings(token, settings.general);
          break;
        case "business":
          await updateBusinessSettings(token, settings.business_information);
          break;
        case "payment":
          await updatePaymentSettings(token, settings.payment_methods);
          break;
        case "inventory":
          await updateInventorySettings(token, settings.inventory_management);
          break;
        case "security":
          await updateSecuritySettings(token, settings.security_settings);
          break;
        case "integrations":
          await updateGoldApiSettings(token, settings.gold_api_settings);
          break;
        default:
          throw new Error("Invalid section");
      }

      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getSettings(token);

        if (response?.data?.status && response?.data?.data) {
          setSettings(response.data.data);
        } else {
          setError("Failed to fetch settings");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setError("Failed to fetch settings. Please try again.");
        toast({
          title: "Error",
          description: "Failed to fetch settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token, toast]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure your application settings and preferences
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading settings...</span>
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure your application settings and preferences
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-medium">Error loading settings</p>
            <p className="text-sm text-muted-foreground">
              {error || "Settings not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your application settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          {/* <TabsTrigger value="inventory">Inventory</TabsTrigger> */}
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>General Settings</span>
              </CardTitle>
              <CardDescription>
                Configure basic site settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.site_name}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: {
                          ...settings.general,
                          site_name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.general.currency}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: {
                          ...settings.general,
                          currency: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.site_description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        site_description: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: {
                          ...settings.general,
                          timezone: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Default Language</Label>
                  <Select
                    value={settings.general.default_language}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: {
                          ...settings.general,
                          default_language: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Maintenance Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable maintenance mode to restrict access to the site
                  </p>
                </div>
                <Switch
                  checked={settings.general.maintenance_mode}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        maintenance_mode: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("General")} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Configure your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.business_information.company_name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business_information: {
                        ...settings.business_information,
                        company_name: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={settings.business_information["Business Address"]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business_information: {
                        ...settings.business_information,
                        "Business Address": e.target.value,
                      },
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.business_information.company_phone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        business_information: {
                          ...settings.business_information,
                          company_phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={settings.business_information.company_email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        business_information: {
                          ...settings.business_information,
                          company_email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gst">GST Number</Label>
                  <Input
                    id="gst"
                    value={settings.business_information.gst_number}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        business_information: {
                          ...settings.business_information,
                          gst_number: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input
                    id="pan"
                    value={settings.business_information.pan_number}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        business_information: {
                          ...settings.business_information,
                          pan_number: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Business")}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
{/* 
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Methods</span>
              </CardTitle>
              <CardDescription>
                Configure payment gateways and methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Razorpay</h4>
                    <p className="text-sm text-muted-foreground">
                      Accept payments via Razorpay gateway
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        settings.payment_methods.razorpay_enabled
                          ? "default"
                          : "secondary"
                      }
                    >
                      {settings.payment_methods.razorpay_enabled
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                    <Switch
                      checked={settings.payment_methods.razorpay_enabled}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          payment_methods: {
                            ...settings.payment_methods,
                            razorpay_enabled: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cash on Delivery</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to pay on delivery
                    </p>
                  </div>
                  <Switch
                    checked={settings.payment_methods.cod_enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        payment_methods: {
                          ...settings.payment_methods,
                          cod_enabled: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">EMI Options</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable EMI payment options
                    </p>
                  </div>
                  <Switch
                    checked={settings.payment_methods.emi_enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        payment_methods: {
                          ...settings.payment_methods,
                          emi_enabled: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Digital Wallet</h4>
                    <p className="text-sm text-muted-foreground">
                      Accept digital wallet payments
                    </p>
                  </div>
                  <Switch
                    checked={settings.payment_methods.digital_wallet_enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        payment_methods: {
                          ...settings.payment_methods,
                          digital_wallet_enabled: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Payment Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="razorpayKey">Razorpay Key ID</Label>
                    <Input
                      id="razorpayKey"
                      type="password"
                      placeholder="Enter Razorpay Key"
                      value={settings.payment_methods.razorpay_key_id}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          payment_methods: {
                            ...settings.payment_methods,
                            razorpay_key_id: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="razorpaySecret">Razorpay Secret</Label>
                    <Input
                      id="razorpaySecret"
                      type="password"
                      placeholder="Enter Razorpay Secret"
                      value={settings.payment_methods.razorpay_secret}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          payment_methods: {
                            ...settings.payment_methods,
                            razorpay_secret: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Payment")} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
   <TabsContent value="payment" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Methods</span>
          </CardTitle>
          <CardDescription>
            Configure payment gateways and methods
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* ----------- Payment Method Toggles ----------- */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Razorpay</h4>
                <p className="text-sm text-muted-foreground">
                  Accept payments via Razorpay gateway
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    settings.payment_methods.razorpay_enabled
                      ? "default"
                      : "secondary"
                  }
                >
                  {settings.payment_methods.razorpay_enabled
                    ? "Active"
                    : "Inactive"}
                </Badge>
                <Switch
                  checked={settings.payment_methods.razorpay_enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      payment_methods: {
                        ...settings.payment_methods,
                        razorpay_enabled: checked,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Cash on Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  Allow customers to pay on delivery
                </p>
              </div>
              <Switch
                checked={settings.payment_methods.cod_enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    payment_methods: {
                      ...settings.payment_methods,
                      cod_enabled: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">EMI Options</h4>
                <p className="text-sm text-muted-foreground">
                  Enable EMI payment options
                </p>
              </div>
              <Switch
                checked={settings.payment_methods.emi_enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    payment_methods: {
                      ...settings.payment_methods,
                      emi_enabled: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Digital Wallet</h4>
                <p className="text-sm text-muted-foreground">
                  Accept digital wallet payments
                </p>
              </div>
              <Switch
                checked={settings.payment_methods.digital_wallet_enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    payment_methods: {
                      ...settings.payment_methods,
                      digital_wallet_enabled: checked,
                    },
                  })
                }
              />
            </div>
          </div>

          <Separator />

          {/* ----------- Payment Configuration ----------- */}
          <div className="space-y-4">
            <h4 className="font-medium">Payment Configuration</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Razorpay Key ID */}
              <div className="relative">
                <Label htmlFor="razorpayKey">Razorpay Key ID</Label>
                <Input
                  id="razorpayKey"
                  type={showKey ? "text" : "password"}
                  placeholder="Enter Razorpay Key"
                  value={settings.payment_methods.razorpay_key_id}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment_methods: {
                        ...settings.payment_methods,
                        razorpay_key_id: e.target.value,
                      },
                    })
                  }
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Razorpay Secret */}
              <div className="relative">
                <Label htmlFor="razorpaySecret">Razorpay Secret</Label>
                <Input
                  id="razorpaySecret"
                  type={showSecret ? "text" : "password"}
                  placeholder="Enter Razorpay Secret"
                  value={settings.payment_methods.razorpay_secret}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment_methods: {
                        ...settings.payment_methods,
                        razorpay_secret: e.target.value,
                      },
                    })
                  }
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                >
                  {showSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ----------- Save Button ----------- */}
          <div className="flex justify-end">
            <Button onClick={() => handleSave("Payment")} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Inventory Management</span>
              </CardTitle>
              <CardDescription>
                Configure inventory tracking and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lowStockAlert">
                    Low Stock Alert Threshold
                  </Label>
                  <Input
                    id="lowStockAlert"
                    type="number"
                    value={
                      settings.inventory_management.low_stock_alert_threshold
                    }
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        inventory_management: {
                          ...settings.inventory_management,
                          low_stock_alert_threshold: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="reorderLevel">Auto Reorder Level</Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    value={settings.inventory_management.auto_reorder_level}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        inventory_management: {
                          ...settings.inventory_management,
                          auto_reorder_level: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Reorder</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically create purchase orders when stock is low
                    </p>
                  </div>
                  <Switch
                    checked={settings.inventory_management.auto_reorder}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        inventory_management: {
                          ...settings.inventory_management,
                          auto_reorder: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Serial Number Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Track individual items by serial numbers
                    </p>
                  </div>
                  <Switch
                    checked={
                      settings.inventory_management.serial_number_tracking
                    }
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        inventory_management: {
                          ...settings.inventory_management,
                          serial_number_tracking: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Barcode System</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable barcode scanning for inventory
                    </p>
                  </div>
                  <Switch
                    checked={settings.inventory_management.barcode_system}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        inventory_management: {
                          ...settings.inventory_management,
                          barcode_system: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Inventory")}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Configure security policies and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin access
                    </p>
                  </div>
                  <Switch
                    checked={
                      settings.security_settings.two_factor_authentication
                    }
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security_settings: {
                          ...settings.security_settings,
                          two_factor_authentication: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Audit Logging</h4>
                    <p className="text-sm text-muted-foreground">
                      Log all admin actions for security
                    </p>
                  </div>
                  <Switch
                    checked={settings.security_settings.audit_logging}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security_settings: {
                          ...settings.security_settings,
                          audit_logging: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security_settings.session_timeout_minutes}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security_settings: {
                          ...settings.security_settings,
                          session_timeout_minutes: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="minLength">Password Minimum Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    min="1"
                    max="50"
                    value={
                      settings.security_settings.password_policy.min_length
                    }
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security_settings: {
                          ...settings.security_settings,
                          password_policy: {
                            ...settings.security_settings.password_policy,
                            min_length: parseInt(e.target.value) || 1,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Password Policy Requirements</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Uppercase</h4>
                      <p className="text-sm text-muted-foreground">
                        Password must contain at least one uppercase letter
                      </p>
                    </div>
                    <Switch
                      checked={
                        settings.security_settings.password_policy
                          .require_uppercase
                      }
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security_settings: {
                            ...settings.security_settings,
                            password_policy: {
                              ...settings.security_settings.password_policy,
                              require_uppercase: checked,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Lowercase</h4>
                      <p className="text-sm text-muted-foreground">
                        Password must contain at least one lowercase letter
                      </p>
                    </div>
                    <Switch
                      checked={
                        settings.security_settings.password_policy
                          .require_lowercase
                      }
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security_settings: {
                            ...settings.security_settings,
                            password_policy: {
                              ...settings.security_settings.password_policy,
                              require_lowercase: checked,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Number</h4>
                      <p className="text-sm text-muted-foreground">
                        Password must contain at least one number
                      </p>
                    </div>
                    <Switch
                      checked={
                        settings.security_settings.password_policy
                          .require_number
                      }
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security_settings: {
                            ...settings.security_settings,
                            password_policy: {
                              ...settings.security_settings.password_policy,
                              require_number: checked,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Special Character</h4>
                      <p className="text-sm text-muted-foreground">
                        Password must contain at least one special character
                      </p>
                    </div>
                    <Switch
                      checked={
                        settings.security_settings.password_policy
                          .require_special_character
                      }
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security_settings: {
                            ...settings.security_settings,
                            password_policy: {
                              ...settings.security_settings.password_policy,
                              require_special_character: checked,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Security")}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>
                Configure external service integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">WhatsApp Business API</h4>
                    <p className="text-sm text-muted-foreground">
                      Send order updates via WhatsApp
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Not Connected</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Google Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Track website analytics and user behavior
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Connected</Badge>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Service (SMTP)</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure email delivery service
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Connected</Badge>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Gold Rate API</h4>
                    <p className="text-sm text-muted-foreground">
                      Auto-update gold/silver rates from external API
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">
                      <div>
                        API Key:{" "}
                        {settings.gold_api_settings.api_key
                          ? "Configured"
                          : "Not configured"}
                      </div>
                      <div>Base URL: {settings.gold_api_settings.base_url}</div>
                      <div>Currency: {settings.gold_api_settings.currency}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        settings.gold_api_settings.api_key
                          ? "default"
                          : "secondary"
                      }
                    >
                      {settings.gold_api_settings.api_key
                        ? "Connected"
                        : "Not Connected"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openGoldApiModal}
                    >
                      {settings.gold_api_settings.api_key
                        ? "Manage"
                        : "Configure"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Integrations")}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Gold API Settings Modal */}
      <Dialog open={goldApiModalOpen} onOpenChange={setGoldApiModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <span>Gold Rate API Configuration</span>
            </DialogTitle>
            <DialogDescription>
              Configure your gold rate API settings for automatic price updates
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="goldApiKey">API Key</Label>
              <Input
                id="goldApiKey"
                type="password"
                placeholder="Enter your API key"
                value={goldApiForm.api_key}
                onChange={(e) =>
                  setGoldApiForm({
                    ...goldApiForm,
                    api_key: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="goldApiBaseUrl">Base URL</Label>
              <Input
                id="goldApiBaseUrl"
                placeholder="https://api.example.com/"
                value={goldApiForm.base_url}
                onChange={(e) =>
                  setGoldApiForm({
                    ...goldApiForm,
                    base_url: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="goldApiCurrency">Currency</Label>
              <Select
                value={goldApiForm.currency}
                onValueChange={(value) =>
                  setGoldApiForm({
                    ...goldApiForm,
                    currency: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setGoldApiModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleGoldApiSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
