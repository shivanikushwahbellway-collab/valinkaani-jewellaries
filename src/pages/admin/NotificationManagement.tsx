import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { getUserList } from "@/lib/api/adminUserController";
import {
  sendNotification,
  getNotifications,
  deleteNotification,
} from "@/lib/api/notificationApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, ChevronDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const NotificationManagement = () => {
  const { token } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("promotion");
  const [scheduleAt, setScheduleAt] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [notificationList, setNotificationList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipientDropdownOpen, setRecipientDropdownOpen] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ------------------------------
  // Fetch user list
  // ------------------------------
  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const res = await getUserList(token);
        setUsers(res.data || []);
      } catch (err) {
        console.log("Error fetching users:", err);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [token, toast]);

  // ------------------------------
  // Fetch Notifications
  // ------------------------------
  useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const res = await getNotifications(token);
        setNotificationList(res.data?.data || []);
      } catch (err) {
        console.error("Error loading notifications", err);
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive",
        });
      }
    };

    fetchNotifications();
  }, [token, toast]);

  // ------------------------------
  // Handle Image Upload
  // ------------------------------
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid file",
        description: "Please select image files only",
        variant: "destructive",
      });
      return;
    }

    setImages((prev) => [...prev, ...imageFiles]);

    // Create previews
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ------------------------------
  // Handle User Selection
  // ------------------------------
  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => String(u.id)));
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const searchLower = recipientSearch.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  // Get selected users for display
  const selectedUsers = users.filter((user) =>
    selectedUserIds.includes(String(user.id))
  );

  // ------------------------------
  // Handle Send Notification
  // ------------------------------
  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in title and message",
        variant: "destructive",
      });
      return;
    }

    if (selectedUserIds.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one recipient",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("message", message);
      formData.append("type", type);

      // Append recipient IDs
      selectedUserIds.forEach((userId) => {
        formData.append("recipient_ids[]", userId);
      });

      // Append schedule_at if provided
      if (scheduleAt) {
        formData.append("schedule_at", scheduleAt);
      }

      // Append images
      images.forEach((image) => {
        formData.append("images[]", image);
      });

      await sendNotification(formData, token);

      toast({
        title: "Success",
        description: "Notification sent successfully!",
      });

      // Reset form
      setTitle("");
      setMessage("");
      setType("promotion");
      setScheduleAt("");
      setSelectedUserIds([]);
      setImages([]);
      setImagePreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh notifications list
      const res = await getNotifications(token);
      setNotificationList(res.data?.data || []);
    } catch (err: any) {
      console.error("Error sending notification", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Title and Description */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Notification Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Send custom notifications to users with scheduling and image support
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="space-y-6"
          >
            {/* Grid 4 Columns - Top Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Title */}
              <div className="lg:col-span-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Type */}
              <div>
                <Label htmlFor="type">Type</Label>
                <Select onValueChange={setType} value={type}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="order">Order</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Schedule At */}
              <div>
                <Label htmlFor="schedule_at">Schedule At</Label>
                <Input
                  id="schedule_at"
                  type="datetime-local"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                />
              </div>
            </div>

            {/* Recipients - Custom Dropdown with Search */}
            <div>
              <Label>
                Recipients <span className="text-red-500">*</span>
              </Label>
              <Popover open={recipientDropdownOpen} onOpenChange={setRecipientDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={recipientDropdownOpen}
                    className="w-full justify-between"
                  >
                    {selectedUserIds.length > 0
                      ? `${selectedUserIds.length} user(s) selected`
                      : "Select recipients..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search users..."
                      value={recipientSearch}
                      onValueChange={setRecipientSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            selectAllUsers();
                          }}
                          className="font-semibold"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedUserIds.length === users.length && users.length > 0
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          Select All ({users.length} users)
                        </CommandItem>
                        {filteredUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => {
                              handleUserToggle(String(user.id));
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUserIds.includes(String(user.id))
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.name} ({user.email})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUsers.map((user) => (
                    <span
                      key={user.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                    >
                      {user.name}
                      <button
                        type="button"
                        onClick={() => handleUserToggle(String(user.id))}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Grid 2 Columns - Bottom Fields (Textarea and Images) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Message Textarea */}
              <div>
                <Label htmlFor="message">
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter notification message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              {/* Images */}
              <div>
                <Label>Images (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer min-h-[120px]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      Click to upload images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WEBP up to 5MB each
                    </p>
                  </div>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Notification"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
        </CardHeader>

        <CardContent>
          {notificationList.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No notifications found.
            </p>
          ) : (
            <div className="space-y-4">
              {notificationList.map((n: any) => (
                <div
                  key={n.id}
                  className="border rounded-lg p-4 flex justify-between items-start hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{n.title}</h3>
                      {n.type && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                          {n.type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {n.message || n.body}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <span>
                        Created:{" "}
                        {new Date(n.created_at || n.createdAt).toLocaleString()}
                      </span>
                      {n.schedule_at && (
                        <span>
                          Scheduled: {new Date(n.schedule_at).toLocaleString()}
                        </span>
                      )}
                      {n.recipient_count && (
                        <span>Recipients: {n.recipient_count}</span>
                      )}
                    </div>
                    {n.images && n.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {n.images.map((img: string, idx: number) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Notification ${n.id} image ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (
                        !confirm(
                          "Are you sure you want to delete this notification?"
                        )
                      ) {
                        return;
                      }
                      try {
                        await deleteNotification(n.id, token);
                        setNotificationList((prev) =>
                          prev.filter((i: any) => i.id !== n.id)
                        );
                        toast({
                          title: "Success",
                          description: "Notification deleted successfully",
                        });
                      } catch (err: any) {
                        console.error("Error deleting notification", err);
                        toast({
                          title: "Error",
                          description:
                            err.response?.data?.message ||
                            "Failed to delete notification",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationManagement;
