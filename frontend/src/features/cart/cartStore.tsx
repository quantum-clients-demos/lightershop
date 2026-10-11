"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, PricingQuote } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "../auth/authStore";

interface CartContextType {
  items: CartItem[];
  storeMode: "retail" | "wholesale";
  setStoreMode: (mode: "retail" | "wholesale") => void;
  addItem: (product: Product, quantity?: number, modeOverride?: "retail" | "wholesale") => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItemsCount: number;
  quote: PricingQuote | null;
  isQuoteLoading: boolean;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: (code: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isWholesaleApproved } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [storeMode, setStoreMode] = useState<"retail" | "wholesale">("retail");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quote, setQuote] = useState<PricingQuote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem("ember_cart_items");
      const savedMode = localStorage.getItem("ember_store_mode");
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedMode === "wholesale" || savedMode === "retail") setStoreMode(savedMode);
    } catch {
      //
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ember_cart_items", JSON.stringify(items));
      localStorage.setItem("ember_store_mode", storeMode);
    } catch {
      //
    }
  }, [items, storeMode]);

  // Recalculate quote whenever items, storeMode or coupon changes
  useEffect(() => {
    if (items.length === 0) {
      setQuote(null);
      return;
    }

    let isMounted = true;
    setIsQuoteLoading(true);

    const payloadItems = items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
      mode: i.mode || storeMode,
    }));

    api
      .getQuote(payloadItems, isWholesaleApproved || storeMode === "wholesale", couponCode)
      .then((q) => {
        if (isMounted) setQuote(q);
      })
      .catch((err) => {
        console.error("Quote recalculation error:", err);
      })
      .finally(() => {
        if (isMounted) setIsQuoteLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [items, storeMode, couponCode, isWholesaleApproved]);

  const addItem = (product: Product, quantity = 1, modeOverride?: "retail" | "wholesale") => {
    const activeMode = modeOverride || storeMode;
    const minQty = activeMode === "wholesale" ? Math.max(quantity, product.min_wholesale_qty) : quantity;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        const existing = next[existingIndex];
        next[existingIndex] = {
          ...existing,
          quantity: existing.quantity + (activeMode === "wholesale" ? product.min_wholesale_qty : quantity),
          mode: activeMode,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            quantity: minQty,
            mode: activeMode,
            product,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const enforcedQty = item.mode === "wholesale" ? Math.max(item.product.min_wholesale_qty, quantity) : quantity;
          return { ...item, quantity: enforcedQty };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setQuote(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const applyCoupon = async (code: string) => {
    setCouponCode(code);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        storeMode,
        setStoreMode,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        totalItemsCount,
        quote,
        isQuoteLoading,
        couponCode,
        setCouponCode,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
