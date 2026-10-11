"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Building2,
  Settings,
  ArrowLeft,
  ShieldCheck,
  Flame,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/admin/orders", label: "Orders & Shipping", icon: <ShoppingBag size={16} /> },
    { href: "/admin/products", label: "Inventory & SKUs", icon: <Package size={16} /> },
    { href: "/admin/wholesale", label: "B2B Wholesale", icon: <Building2 size={16} /> },
    { href: "/admin/settings", label: "System Config", icon: <Settings size={16} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f6f4ee", display: "flex", flexDirection: "column" }}>
      {/* Top Admin Bar */}
      <header style={{
        backgroundColor: "#111111",
        color: "#ffffff",
        borderBottom: "1px solid #242424",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div className="container" style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo & Portal Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/" style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-mono)",
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "#ffffff",
            }}>
              <span>EMBER&CO.</span>
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--accent-spark)",
                display: "inline-block",
                boxShadow: "0 0 8px var(--accent-spark)",
              }} />
            </Link>

            <span style={{
              fontSize: "10px",
              background: "rgba(200, 90, 23, 0.2)",
              border: "1px solid rgba(200, 90, 23, 0.4)",
              color: "#ffaa6b",
              padding: "3px 8px",
              borderRadius: "2px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}>
              <ShieldCheck size={12} />
              OPERATIONS CONSOLE
            </span>
          </div>

          {/* Right Navigation Shortcut */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "#c0bbb4",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "2px",
                border: "1px solid #333",
                transition: "all 0.2s",
              }}
            >
              <ArrowLeft size={14} /> View Live Storefront
            </Link>
          </div>
        </div>

        {/* Admin Navigation Sub-Bar */}
        <div style={{
          backgroundColor: "#191919",
          borderTop: "1px solid #262626",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}>
          <div className="container" style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "max-content",
            paddingTop: "4px",
            paddingBottom: "4px",
          }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 16px",
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#ffffff" : "#a39e95",
                    borderBottom: isActive ? "2px solid var(--accent-spark)" : "2px solid transparent",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ color: isActive ? "var(--accent-spark)" : "inherit" }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* Admin Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-light)",
        backgroundColor: "#ede8df",
        padding: "18px 0",
        fontSize: "12px",
        color: "var(--text-muted)",
      }}>
        <div className="container" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div>
            EMBER & CO. Master Control • Supabase PostgreSQL • Razorpay Secured
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <span>Environment: Production Demo</span>
            <span>API v1 Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
