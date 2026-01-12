import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface QuantityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number, size?: string | number) => void;
  productName: string;
  loading?: boolean;
  sizes?: { size: string | number }[];
  purity?: string;
  weight?: number | string;
  initialQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

const QuantityDialog: React.FC<QuantityDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  loading = false,
  sizes = [],
  purity,
  weight,
  initialQuantity = 1,
  minQuantity = 1,
  maxQuantity = 9999,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | number | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity, isOpen]);

  // Keep quantity within bounds
  const clamp = (v: number) => {
    if (Number.isNaN(v)) return minQuantity;
    if (v < minQuantity) return minQuantity;
    if (v > maxQuantity) return maxQuantity;
    return Math.floor(v);
  };

  const inc = () => setQuantity((q) => clamp(q + 1));
  const dec = () => setQuantity((q) => clamp(q - 1));

  const onManualChange = (val: string) => {
    // allow empty while typing
    if (val === "") {
      setQuantity(minQuantity);
      return;
    }
    const n = parseInt(val, 10);
    if (!isNaN(n)) setQuantity(clamp(n));
  };

  const handleConfirm = () => {
    if (!selectedSize) return;
    const q = clamp(quantity);
    onConfirm(q, selectedSize);
  };

  // keyboard: +/- keys increment/decrement when focus inside dialog
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ignore when input is focused to avoid double handling
      const active = document.activeElement;
      const isInputFocused = active && (active.tagName === "INPUT" || active?.getAttribute("role") === "spinbutton");
      if (isInputFocused) return;
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        inc();
      } else if (e.key === "-") {
        e.preventDefault();
        dec();
      }
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Size & Quantity</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <Label>Product</Label>
              <p className="mt-1">{productName}</p>
            </div>
            {purity && (
              <div>
                <Label>Purity</Label>
                <p className="mt-1">{purity}</p>
              </div>
            )}
            {weight && (
              <div>
                <Label>Weight</Label>
                <p className="mt-1">{String(weight)}g</p>
              </div>
            )}
          </div>

          {/* Size + Quantity Row */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Size</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizes && sizes.length > 0 ? (
                    sizes.map((s, idx) => {
                      const isSelected = String(s.size) === String(selectedSize);
                      return (
                        <button
                          key={`${s.size}-${idx}`}
                          type="button"
                          onClick={() => setSelectedSize(s.size)}
                          className={`px-3 py-1.5 text-sm rounded-full border transition select-none
                            ${isSelected
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"}`}
                        >
                          {String(s.size)}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No sizes</p>
                  )}
                </div>
              </div>

              {/* Quantity Selector — same UI as Cart page */}
              <div className="ml-4 flex flex-col items-end">
                <Label className="text-sm font-medium text-gray-700">Quantity</Label>

                <div className="mt-2 flex items-center bg-gray-100 border border-gray-200 rounded-full shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-[#084526]/40 transition">
                  {/* Minus Button */}
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={dec}
                    disabled={loading || quantity <= minQuantity}
                    className="px-3 py-2 text-lg text-[#084526] hover:bg-[#084526]/10 transition disabled:opacity-50"
                  >
                    −
                  </button>

                  {/* Input */}
                  <input
                    ref={inputRef}
                    aria-label="Quantity"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(e) => onManualChange(e.target.value)}
                    onFocus={(e) => e.currentTarget.select()}
                    className="w-12 text-center bg-transparent text-sm font-medium focus:outline-none appearance-none border-none"
                  />

                  {/* Plus Button */}
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={inc}
                    disabled={loading || quantity >= maxQuantity}
                    className="px-3 py-2 text-lg text-[#084526] hover:bg-[#084526]/10 transition disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading || !selectedSize || quantity < minQuantity}
              className="bg-[#084526] hover:bg-[#0a5a2e]"
            >
              {loading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuantityDialog;
