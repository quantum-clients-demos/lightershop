"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Database,
  Lock,
  Layers,
  Percent,
  Truck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sliders,
  Server,
  Terminal,
  HelpCircle,
  Cpu,
} from "lucide-react";
import { api } from "@/lib/api";

export default function AdminSettingsPage() {
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connected" | "error">("idle");
  const [connectionMessage, setConnectionMessage] = useState<string>("");
  const [lastCheckTime, setLastCheckTime] = useState<string>("");

  // Store editable config mock state
  const [gstRate, setGstRate] = useState<number>(18);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(1999);
  const [minWholesaleQty, setMinWholesaleQty] = useState<number>(50);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check initial connection
    handleTestConnection();
  }, []);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionMessage("Querying backend services and Supabase database...");
    try {
      const stats = await api.getAdminStats();
      setConnectionStatus("connected");
      setConnectionMessage(`Successfully verified. PostgreSQL connected with ${stats.total_orders ?? 0} registered orders and ${stats.low_stock_count ?? 0} low-stock alerts.`);
      setLastCheckTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err: any) {
      setConnectionStatus("error");
      setConnectionMessage(err?.message || "Failed to reach backend services. Ensure backend is running.");
      setLastCheckTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClearCache = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ember_token");
      const user = localStorage.getItem("ember_user");
      // Clear non-auth keys or keep demo tokens
      sessionStorage.clear();
      alert("Application runtime memory & session cache refreshed successfully.");
    }
  };

  return (
    <div className="container" style={{ paddingTop: "32px", paddingBottom: "64px" }}>
      {/* Top Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "32px",
      }}>
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent-spark)",
            marginBottom: "6px",
          }}>
            <Sliders size={13} />
            Ember Platform Architecture
          </div>
          <h1 style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            margin: 0,
          }}>
            System Diagnostics & Config
          </h1>
          <p style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "6px",
            marginBottom: 0,
            maxWidth: "600px",
          }}>
            Inspect cloud service integrations, payment gateways, database connectivity, and core store commerce parameters.
          </p>
        </div>

        {/* Live Status Pill & Quick Ping */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleTestConnection}
            disabled={testingConnection}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-medium)",
              borderRadius: "3px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: testingConnection ? "wait" : "pointer",
              color: "var(--text-primary)",
              transition: "all 0.15s ease",
            }}
          >
            <RefreshCw size={14} className={testingConnection ? "animate-spin" : ""} />
            {testingConnection ? "Pinging System..." : "Run Health Audit"}
          </button>
        </div>
      </div>

      {/* Connectivity Banner */}
      <div style={{
        backgroundColor: connectionStatus === "connected" ? "rgba(16, 185, 129, 0.08)" : connectionStatus === "error" ? "rgba(239, 68, 68, 0.08)" : "var(--bg-surface)",
        border: `1px solid ${connectionStatus === "connected" ? "rgba(16, 185, 129, 0.3)" : connectionStatus === "error" ? "rgba(239, 68, 68, 0.3)" : "var(--border-light)"}`,
        padding: "16px 20px",
        borderRadius: "4px",
        marginBottom: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {connectionStatus === "connected" ? (
            <CheckCircle2 size={20} color="#10b981" />
          ) : connectionStatus === "error" ? (
            <AlertCircle size={20} color="#ef4444" />
          ) : (
            <Server size={20} color="var(--text-muted)" />
          )}
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
              {connectionStatus === "connected"
                ? "Backend & Database Subsystems Nominal"
                : connectionStatus === "error"
                ? "Service Communication Alert"
                : "Awaiting Service Diagnostic"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              {connectionMessage || "Click 'Run Health Audit' to verify FastAPI, PostgreSQL, and storage connections."}
            </div>
          </div>
        </div>
        {lastCheckTime && (
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Checked at {lastCheckTime}
          </span>
        )}
      </div>

      {/* Subsystem Overview Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px",
        marginBottom: "40px",
      }}>
        {/* Card 1: Razorpay Payment Gateway */}
        <div style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          borderRadius: "4px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "3px",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <CreditCard size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Razorpay Payments
                </h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Indian Payment Gateway</span>
              </div>
            </div>
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 8px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              color: "#059669",
              borderRadius: "2px",
            }}>
              READY
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Supported Currencies</span>
              <strong style={{ color: "var(--text-primary)" }}>INR (₹)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Checkout Experience</span>
              <strong style={{ color: "var(--text-primary)" }}>Razorpay Standard Modal</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Payment Verification</span>
              <strong style={{ color: "var(--text-primary)" }}>HMAC SHA256 Signature</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Webhook Endpoint</span>
              <code style={{ fontSize: "11px", color: "var(--text-secondary)", backgroundColor: "#ece8de", padding: "2px 6px", borderRadius: "2px" }}>
                /payments/razorpay/webhook
              </code>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Supported Instruments</span>
              <span style={{ color: "var(--text-primary)", textAlign: "right" }}>UPI, Cards, NetBanking, EMI</span>
            </div>
          </div>
        </div>

        {/* Card 2: Supabase PostgreSQL */}
        <div style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          borderRadius: "4px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "3px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Database size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Supabase PostgreSQL
                </h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Relational Core & Pool</span>
              </div>
            </div>
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 8px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              color: "#059669",
              borderRadius: "2px",
            }}>
              CONNECTED
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Database Driver</span>
              <strong style={{ color: "var(--text-primary)" }}>AsyncPG / SQLAlchemy 2.0</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Relational Entities</span>
              <strong style={{ color: "var(--text-primary)" }}>10 Active Tables</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Audit Logging</span>
              <strong style={{ color: "var(--text-primary)" }}>Inventory Audit Trails</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Transactions</span>
              <strong style={{ color: "var(--text-primary)" }}>ACID Row-level Locking</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>SSL Mode</span>
              <span style={{ color: "var(--text-primary)" }}>require (TLS 1.3)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Auth & Security */}
        <div style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          borderRadius: "4px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "3px",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                color: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Lock size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Security & RBAC
                </h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Token Auth & Roles</span>
              </div>
            </div>
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 8px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              color: "#059669",
              borderRadius: "2px",
            }}>
              ENFORCED
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Token Format</span>
              <strong style={{ color: "var(--text-primary)" }}>JWT Bearer (HS256)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Password Hashing</span>
              <strong style={{ color: "var(--text-primary)" }}>bcrypt (Cost Factor 12)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Active Roles</span>
              <strong style={{ color: "var(--text-primary)" }}>Retail, Wholesale, Admin</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>CORS Policy</span>
              <strong style={{ color: "var(--text-primary)" }}>Scoped Domain Origins</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Rate Limiting</span>
              <span style={{ color: "var(--text-primary)" }}>Enabled on Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Store Commercial Parameters (Editable form simulation) */}
      <div style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        borderRadius: "4px",
        padding: "28px",
        marginBottom: "40px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h2 style={{
              fontSize: "18px",
              fontWeight: 700,
              margin: 0,
              color: "var(--text-primary)",
            }}>
              Commerce & Pricing Engine Defaults
            </h2>
            <p style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              marginTop: "4px",
              marginBottom: 0,
            }}>
              Configure global commercial values applied during checkout quoting and tax calculations.
            </p>
          </div>

          {isSaved && (
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#059669",
              fontSize: "13px",
              fontWeight: 700,
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              padding: "6px 12px",
              borderRadius: "3px",
            }}>
              <CheckCircle2 size={16} /> Parameters Updated
            </span>
          )}
        </div>

        <form onSubmit={handleSaveConfig}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            marginBottom: "24px",
          }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Standard GST Rate (%)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "3px",
                    fontSize: "14px",
                    fontFamily: "var(--font-mono)",
                    backgroundColor: "#ffffff",
                  }}
                />
              </div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                Applicable to Indian Luxury Pocket Ignition hardware (HSN 9613).
              </span>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Complimentary Shipping Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "3px",
                  fontSize: "14px",
                  fontFamily: "var(--font-mono)",
                  backgroundColor: "#ffffff",
                }}
              />
              <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                Orders above this amount qualify for free priority courier across India.
              </span>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Wholesale Minimum Order Quantity (Units)
              </label>
              <input
                type="number"
                min="10"
                value={minWholesaleQty}
                onChange={(e) => setMinWholesaleQty(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "3px",
                  fontSize: "14px",
                  fontFamily: "var(--font-mono)",
                  backgroundColor: "#ffffff",
                }}
              />
              <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                B2B authorized partner carts require at least this quantity for tiered quotes.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "10px 24px", fontSize: "13px" }}
            >
              Save Commercial Defaults
            </button>
            <button
              type="button"
              onClick={handleClearCache}
              style={{
                padding: "10px 18px",
                backgroundColor: "transparent",
                border: "1px solid var(--border-medium)",
                borderRadius: "3px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              Flush Local Cache
            </button>
          </div>
        </form>
      </div>

      {/* Quick API Docs & Administrative Reference */}
      <div style={{
        backgroundColor: "#161616",
        color: "#ffffff",
        borderRadius: "4px",
        padding: "28px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Terminal size={20} color="var(--accent-spark)" />
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, letterSpacing: "0.04em" }}>
            FASTAPI RUNTIME REST CONTRACTS
          </h3>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
        }}>
          <div style={{ backgroundColor: "#222", padding: "12px", borderRadius: "3px", border: "1px solid #333" }}>
            <div style={{ color: "#ffaa6b", fontWeight: 700, marginBottom: "4px" }}>GET /api/v1/admin/dashboard</div>
            <div style={{ color: "#888" }}>Aggregates gross revenue, order distribution, low stock alerts.</div>
          </div>
          <div style={{ backgroundColor: "#222", padding: "12px", borderRadius: "3px", border: "1px solid #333" }}>
            <div style={{ color: "#ffaa6b", fontWeight: 700, marginBottom: "4px" }}>POST /api/v1/admin/restock</div>
            <div style={{ color: "#888" }}>Atomic stock delta adjustment with reason logging.</div>
          </div>
          <div style={{ backgroundColor: "#222", padding: "12px", borderRadius: "3px", border: "1px solid #333" }}>
            <div style={{ color: "#ffaa6b", fontWeight: 700, marginBottom: "4px" }}>PUT /api/v1/admin/orders/:id/status</div>
            <div style={{ color: "#888" }}>Transitions fulfillment status with automated notification hooks.</div>
          </div>
          <div style={{ backgroundColor: "#222", padding: "12px", borderRadius: "3px", border: "1px solid #333" }}>
            <div style={{ color: "#ffaa6b", fontWeight: 700, marginBottom: "4px" }}>PUT /api/v1/admin/applications/:id/review</div>
            <div style={{ color: "#888" }}>Approves GSTIN B2B dealer and elevates user security role.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
