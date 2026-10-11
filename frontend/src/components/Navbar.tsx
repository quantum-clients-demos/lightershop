"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/features/cart/cartStore";
import { useAuth } from "@/features/auth/authStore";
import { ShoppingBag, User as UserIcon, ShieldCheck } from "lucide-react";

export function Navbar({ onOpenWholesaleModal }: { onOpenWholesaleModal?: () => void }) {
  const { totalItemsCount, openCart, storeMode, setStoreMode } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "76px",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: "var(--text-main)",
            textTransform: "uppercase",
          }}>
            EMBER&CO.
          </span>
          <span style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "var(--accent-spark)",
            display: "inline-block",
            boxShadow: "0 0 8px var(--accent-spark)",
          }} />
        </Link>

        {/* Navigation links */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "36px",
        }} className="desktop-nav">
          <Link
            href="/collection"
            style={{
              fontSize: "13px",
              color: "var(--text-main)",
              letterSpacing: "0.03em",
              fontWeight: 500,
              transition: "color var(--transition-fast)",
            }}
          >
            Shop lighters
          </Link>
          <Link
            href="/approach"
            style={{
              fontSize: "13px",
              color: "var(--text-main)",
              letterSpacing: "0.03em",
              fontWeight: 500,
            }}
          >
            Our approach
          </Link>
          <Link
            href="/wholesale"
            style={{
              fontSize: "13px",
              color: storeMode === "wholesale" ? "var(--accent-spark)" : "var(--text-main)",
              letterSpacing: "0.03em",
              fontWeight: storeMode === "wholesale" ? 700 : 500,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Wholesale B2B
            <span style={{
              fontSize: "9px",
              background: storeMode === "wholesale" ? "var(--accent-spark)" : "#e8e3d8",
              color: storeMode === "wholesale" ? "#ffffff" : "#444",
              padding: "2px 6px",
              borderRadius: "3px",
              fontWeight: 700,
            }}>
              TIER PRICING
            </span>
          </Link>
          <Link
            href="/checkout/track"
            style={{
              fontSize: "13px",
              color: "var(--text-main)",
              letterSpacing: "0.03em",
              fontWeight: 500,
            }}
          >
            Track Order
          </Link>
          <Link
            href="/contact"
            style={{
              fontSize: "13px",
              color: "var(--text-main)",
              letterSpacing: "0.03em",
              fontWeight: 500,
            }}
          >
            Contact
          </Link>
          <Link
            href="/account"
            style={{
              fontSize: "13px",
              color: "var(--text-main)",
              letterSpacing: "0.03em",
              fontWeight: 500,
            }}
          >
            Account
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              style={{
                fontSize: "12px",
                color: "#c85a17",
                letterSpacing: "0.05em",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(200, 90, 23, 0.08)",
                padding: "4px 8px",
                borderRadius: "3px",
              }}
            >
              <ShieldCheck size={14} /> Admin
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Mode switch button */}
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "#ebe6dc",
            borderRadius: "20px",
            padding: "3px",
            border: "1px solid var(--border-light)",
          }}>
            <button
              onClick={() => setStoreMode("retail")}
              style={{
                fontSize: "11px",
                fontWeight: storeMode === "retail" ? 700 : 500,
                color: storeMode === "retail" ? "#ffffff" : "var(--text-muted)",
                backgroundColor: storeMode === "retail" ? "#141414" : "transparent",
                padding: "5px 12px",
                borderRadius: "16px",
                transition: "all var(--transition-fast)",
                letterSpacing: "0.05em",
              }}
            >
              Retail
            </button>
            <button
              onClick={() => setStoreMode("wholesale")}
              style={{
                fontSize: "11px",
                fontWeight: storeMode === "wholesale" ? 700 : 500,
                color: storeMode === "wholesale" ? "#ffffff" : "var(--text-muted)",
                backgroundColor: storeMode === "wholesale" ? "var(--accent-spark)" : "transparent",
                padding: "5px 12px",
                borderRadius: "16px",
                transition: "all var(--transition-fast)",
                letterSpacing: "0.05em",
              }}
            >
              Wholesale
            </button>
          </div>

          {/* Account link icon */}
          <Link
            href="/account"
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--text-main)",
            }}
            title={isAuthenticated ? `Logged in as ${user?.full_name}` : "Sign In / Account"}
          >
            <UserIcon size={20} strokeWidth={1.7} />
          </Link>

          {/* Bag Button */}
          <button
            onClick={openCart}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "var(--text-main)",
              padding: "8px 14px",
              borderRadius: "2px",
              border: "1px solid var(--border-light)",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              transition: "all var(--transition-fast)",
            }}
          >
            <ShoppingBag size={18} strokeWidth={2} />
            <span>BAG ({totalItemsCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
