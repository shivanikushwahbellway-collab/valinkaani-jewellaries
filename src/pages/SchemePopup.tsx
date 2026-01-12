// src/components/SchemePopup.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { UserScheme } from "@/lib/api/userSchemesController";

interface SchemePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheme: UserScheme | null;
  onPayNow: (amount: number) => void;
}

export default function SchemePopup({ open, onOpenChange, scheme, onPayNow }: SchemePopupProps) {
  const [amount, setAmount] = useState<string>(scheme?.minAmount ? String(scheme.minAmount) : "");
  const [error, setError] = useState<string>("");

  if (!scheme) return null;

  const handlePayNow = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num < scheme.minAmount) {
      setError(`Amount must be at least ₹${scheme.minAmount}`);
      return;
    }
    setError("");
    onPayNow(num);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start Your Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Scheme Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{scheme.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">Duration: {scheme.timeline.replace("months", " Months")}</Badge>
                <Badge variant="outline">Min: ₹{scheme.minAmount}/month</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {scheme.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="customAmount">Enter Monthly Amount</Label>
         
            <Input
              id="customAmount"
              type="number"
              min={scheme.minAmount}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError("");
              }}
              placeholder={`e.g. ${scheme.minAmount}`}
              onKeyDown={(e) => e.key === "Enter" && handlePayNow()}
            />
            
        {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePayNow} disabled={!amount || parseFloat(amount) < scheme.minAmount}>
            Pay Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}