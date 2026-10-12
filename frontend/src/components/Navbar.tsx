"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/features/cart/cartStore";
import { useAuth } from "@/features/auth/authStore";
import {
  ShoppingBag,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  Building2,
  Flame,
  Truck,
} from "lucide-react";

export function Navbar({ onOpenWholesaleModal }: { onOpenWholesaleModal?: () => void }) {
  const { totalItemsCount, openCart, storeMode, setStoreMode } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Lock body scroll and listen for Escape key when full-screen mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "76px",
      }}>
        {/* Logo */}
        <Link href="/" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(18px, 4vw, 22px)",
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

        {/* Desktop Navigation links */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Mode switch button on Desktop/Tablet */}
          <div
            className="mode-switch-pill"
            style={{
              display: "flex",
              alignItems: "center",
              background: "#ebe6dc",
              borderRadius: "20px",
              padding: "3px",
              border: "1px solid var(--border-light)",
            }}
          >
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
            className="navbar-account-link"
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--text-main)",
              padding: "6px",
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
              gap: "6px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "var(--text-main)",
              padding: "8px 12px",
              borderRadius: "2px",
              border: "1px solid var(--border-light)",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              transition: "all var(--transition-fast)",
              whiteSpace: "nowrap",
            }}
          >
            <ShoppingBag size={17} strokeWidth={2} />
            <span>BAG ({totalItemsCount})</span>
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-hamburger-btn"
            aria-label="Toggle mobile menu"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              borderRadius: "3px",
              border: "1px solid var(--border-light)",
              background: "#ebe6dc",
              color: "var(--text-main)",
            }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay animate-fade-in"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100dvh",
            backgroundColor: "#f7f5f0",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top Header Bar inside Full-Screen Menu */}
          <div
            style={{
              height: "72px",
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--border-light)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              flexShrink: 0,
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              onClick={closeMenu}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  color: "var(--text-main)",
                  textTransform: "uppercase",
                }}
              >
                EMBER&CO.
              </span>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--accent-spark)",
                  display: "inline-block",
                  boxShadow: "0 0 8px var(--accent-spark)",
                }}
              />
            </Link>

            {/* Prominent Close Button */}
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close mobile menu"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "20px",
                border: "1px solid var(--border-light)",
                backgroundColor: "#141414",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "all var(--transition-fast)",
              }}
            >
              <X size={16} strokeWidth={2.5} />
              <span>CLOSE</span>
            </button>
          </div>

          {/* Scrollable Content */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              padding: "20px 20px 40px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              {/* Purchase Mode Switcher inside mobile drawer */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border-light)",
                  borderRadius: "6px",
                  padding: "16px",
                  marginBottom: "20px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Select Purchase Mode
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: storeMode === "wholesale" ? "var(--accent-spark)" : "var(--text-main)",
                      background: storeMode === "wholesale" ? "rgba(200, 90, 23, 0.1)" : "#f0ece3",
                      padding: "2px 8px",
                      borderRadius: "12px",
                    }}
                  >
                    {storeMode === "wholesale" ? "★ B2B 40% OFF" : "✓ RETAIL SINGLE"}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setStoreMode("retail")}
                    style={{
                      padding: "11px 12px",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      borderRadius: "4px",
                      backgroundColor: storeMode === "retail" ? "#141414" : "#f4f0e6",
                      color: storeMode === "retail" ? "#ffffff" : "var(--text-main)",
                      border: "1px solid var(--border-light)",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    Retail Single
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoreMode("wholesale")}
                    style={{
                      padding: "11px 12px",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      borderRadius: "4px",
                      backgroundColor: storeMode === "wholesale" ? "var(--accent-spark)" : "#f4f0e6",
                      color: storeMode === "wholesale" ? "#ffffff" : "var(--text-main)",
                      border: "1px solid var(--border-light)",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    Wholesale B2B
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <Link
                  href="/collection"
                  onClick={closeMenu}
                  style={{
                    padding: "14px 16px",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text-main)",
                    backgroundColor: "#ffffff",
                    borderRadius: "4px",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Flame size={17} color="var(--accent-spark)" />
                    <span>Shop Lighter Catalog</span>
                  </div>
                  <ArrowRight size={16} color="var(--accent-spark)" />
                </Link>

                <Link
                  href="/wholesale"
                  onClick={closeMenu}
                  style={{
                    padding: "14px 16px",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: storeMode === "wholesale" ? "var(--accent-spark)" : "var(--text-main)",
                    backgroundColor: storeMode === "wholesale" ? "rgba(200, 90, 23, 0.06)" : "#ffffff",
                    borderRadius: "4px",
                    border: storeMode === "wholesale" ? "1px solid var(--accent-spark)" : "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Building2 size={17} color="var(--accent-spark)" />
                    <span>Wholesale B2B Portal</span>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      background: "var(--accent-spark)",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontWeight: 700,
                    }}
                  >
                    TIER PRICING
                  </span>
                </Link>

                <Link
                  href="/approach"
                  onClick={closeMenu}
                  style={{
                    padding: "14px 16px",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text-main)",
                    backgroundColor: "#ffffff",
                    borderRadius: "4px",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Our Engineering & Craft</span>
                  <ArrowRight size={16} color="#aaa" />
                </Link>

                <Link
                  href="/checkout/track"
                  onClick={closeMenu}
                  style={{
                    padding: "14px 16px",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text-main)",
                    backgroundColor: "#ffffff",
                    borderRadius: "4px",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Truck size={17} color="var(--text-muted)" />
                    <span>Track Consignment</span>
                  </div>
                  <ArrowRight size={16} color="#aaa" />
                </Link>

                <Link
                  href="/contact"
                  onClick={closeMenu}
                  style={{
                    padding: "14px 16px",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text-main)",
                    backgroundColor: "#ffffff",
                    borderRadius: "4px",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Boutiques & Concierge</span>
                  <ArrowRight size={16} color="#aaa" />
                </Link>

                <Link
                  href="/account"
                  onClick={closeMenu}
                  style={{
                    padding: "14px 16px",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text-main)",
                    backgroundColor: "#ffffff",
                    borderRadius: "4px",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <UserIcon size={17} color="var(--text-muted)" />
                    <span>{isAuthenticated ? `Account (${user?.full_name})` : "Account & Login"}</span>
                  </div>
                  <ArrowRight size={16} color="#aaa" />
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    style={{
                      padding: "14px 16px",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "var(--accent-spark)",
                      background: "rgba(200, 90, 23, 0.08)",
                      border: "1px solid rgba(200, 90, 23, 0.2)",
                      borderRadius: "4px",
                      marginTop: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <ShieldCheck size={18} />
                    <span>Admin Operations Panel</span>
                  </Link>
                )}
              </nav>

              {/* Bottom Quick Cart Action in Menu */}
              <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    openCart();
                  }}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "13px",
                    backgroundColor: "#141414",
                    color: "#ffffff",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  <ShoppingBag size={17} />
                  <span>VIEW BAG ({totalItemsCount})</span>
                </button>

                {onOpenWholesaleModal && (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onOpenWholesaleModal();
                    }}
                    style={{
                      padding: "13px 16px",
                      backgroundColor: "#ffffff",
                      border: "1px solid var(--border-light)",
                      borderRadius: "4px",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--accent-spark)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    B2B INQUIRY
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Bottom Footer */}
            <div style={{ marginTop: "32px", textAlign: "center", fontSize: "12px", color: "var(--text-muted)" }}>
              <p style={{ fontWeight: 600 }}>Ember & Co. Luxury Pocket Mechanics</p>
              <p style={{ marginTop: "4px", fontSize: "11px", color: "#8a857d" }}>
                Complimentary Pan-India Express Delivery · 18% GST Input Credit
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .mode-switch-pill {
            display: none !important;
          }
          .navbar-account-link {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
