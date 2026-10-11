"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/features/auth/authStore";
import { api } from "@/lib/api";
import { Order, WholesaleApplication } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { User, LogOut, Package, Building2, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function AccountPage() {
  const { user, isAuthenticated, login, register, logout, isWholesaleApproved } = useAuth();

  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [isWholesaleCheck, setIsWholesaleCheck] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [wholesaleApp, setWholesaleApp] = useState<WholesaleApplication | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.getMyOrders().then(setOrders).catch(() => {});
      api.getWholesaleStatus().then(setWholesaleApp).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (authTab === "login") {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          full_name: fullName,
          phone,
          company_name: companyName,
          gstin,
          is_wholesale_applicant: isWholesaleCheck,
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AnnouncementBar />
      <Navbar />

      <main style={{ flex: 1, backgroundColor: "var(--bg-primary)", padding: "60px 0 100px 0" }}>
        <div className="container" style={{ maxWidth: "1000px" }}>
          {!isAuthenticated ? (
            /* Auth Form Card */
            <div style={{
              maxWidth: "480px",
              margin: "0 auto",
              backgroundColor: "#ffffff",
              padding: "40px",
              borderRadius: "4px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
            }}>
              {/* Tab Selector */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginBottom: "28px",
                backgroundColor: "#f4f0ea",
                padding: "4px",
                borderRadius: "3px",
              }}>
                <button
                  type="button"
                  onClick={() => setAuthTab("login")}
                  style={{
                    padding: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    borderRadius: "2px",
                    backgroundColor: authTab === "login" ? "#ffffff" : "transparent",
                    color: authTab === "login" ? "var(--text-main)" : "var(--text-muted)",
                    boxShadow: authTab === "login" ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab("register")}
                  style={{
                    padding: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    borderRadius: "2px",
                    backgroundColor: authTab === "register" ? "#ffffff" : "transparent",
                    color: authTab === "register" ? "var(--text-main)" : "var(--text-muted)",
                    boxShadow: authTab === "register" ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              <h1 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "26px",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "6px",
              }}>
                {authTab === "login" ? "Sign in to Ember & Co." : "Join Ember & Co."}
              </h1>

              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
                {authTab === "login"
                  ? "Access your retail orders and wholesale pricing status."
                  : "Register for retail checkout or apply for B2B wholesale access."}
              </p>

              {errorMsg && (
                <div style={{
                  padding: "10px 14px",
                  background: "#fde8e8",
                  color: "#9b1c1c",
                  borderRadius: "3px",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {authTab === "register" && (
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid var(--border-light)",
                        borderRadius: "2px",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      fontSize: "13px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      fontSize: "13px",
                    }}
                  />
                </div>

                {authTab === "register" && (
                  <>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      margin: "6px 0",
                    }}>
                      <input
                        type="checkbox"
                        id="wholesaleCheck"
                        checked={isWholesaleCheck}
                        onChange={(e) => setIsWholesaleCheck(e.target.checked)}
                      />
                      <label htmlFor="wholesaleCheck" style={{ fontSize: "12px", fontWeight: 600 }}>
                        I am applying for a Wholesale Business Account
                      </label>
                    </div>

                    {isWholesaleCheck && (
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        background: "#faf8f5",
                        padding: "14px",
                        borderRadius: "3px",
                        border: "1px solid var(--border-light)",
                      }}>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                            Company / Entity Name *
                          </label>
                          <input
                            type="text"
                            required={isWholesaleCheck}
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px 10px",
                              border: "1px solid var(--border-light)",
                              borderRadius: "2px",
                              fontSize: "12px",
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                            GSTIN (Goods and Services Tax ID) *
                          </label>
                          <input
                            type="text"
                            required={isWholesaleCheck}
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value.toUpperCase())}
                            style={{
                              width: "100%",
                              padding: "8px 10px",
                              border: "1px solid var(--border-light)",
                              borderRadius: "2px",
                              fontSize: "12px",
                              fontFamily: "var(--font-mono)",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                  style={{
                    padding: "14px",
                    width: "100%",
                    marginTop: "8px",
                  }}
                >
                  {isLoading
                    ? "PLEASE WAIT..."
                    : authTab === "login"
                    ? "SIGN IN"
                    : "REGISTER ACCOUNT"}
                </button>
              </form>
            </div>
          ) : (
            /* User Profile & Dashboard */
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {/* Profile Bar */}
              <div style={{
                backgroundColor: "#ffffff",
                padding: "28px 32px",
                borderRadius: "4px",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
              }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--accent-spark)", fontWeight: 700, textTransform: "uppercase" }}>
                    SIGNED IN AS
                  </div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 700, color: "var(--text-main)" }}>
                    {user?.full_name}
                  </h1>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    {user?.email} {user?.company_name && `• ${user.company_name}`}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "6px 12px",
                    borderRadius: "3px",
                    background: isWholesaleApproved ? "rgba(45, 138, 84, 0.12)" : "#f0ece3",
                    color: isWholesaleApproved ? "var(--accent-green)" : "#141414",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}>
                    {isWholesaleApproved ? <CheckCircle2 size={14} /> : <User size={14} />}
                    <span>{isWholesaleApproved ? "WHOLESALE BUYER" : "RETAIL CUSTOMER"}</span>
                  </div>

                  <button
                    onClick={logout}
                    className="btn-secondary"
                    style={{ padding: "8px 16px", fontSize: "11px" }}
                  >
                    <LogOut size={13} /> SIGN OUT
                  </button>
                </div>
              </div>

              {/* Wholesale Application Status Banner */}
              {user?.role === "wholesale_pending" && (
                <div style={{
                  backgroundColor: "#fff8ed",
                  border: "1px solid #fed7aa",
                  padding: "20px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}>
                  <Clock size={24} color="var(--accent-spark)" />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#9a3412" }}>
                      Wholesale Application Under Review
                    </div>
                    <div style={{ fontSize: "13px", color: "#7c2d12" }}>
                      Our merchant team is reviewing your GSTIN and business credentials. You can still browse and make purchases in retail mode.
                    </div>
                  </div>
                </div>
              )}

              {/* Orders History */}
              <div style={{
                backgroundColor: "#ffffff",
                padding: "32px",
                borderRadius: "4px",
                border: "1px solid var(--border-light)",
              }}>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-main)", marginBottom: "20px" }}>
                  Order History & Invoices
                </h2>

                {orders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "13px" }}>
                    No orders placed yet. Explore our lighter collection to place your first order.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        style={{
                          border: "1px solid var(--border-light)",
                          padding: "18px 20px",
                          borderRadius: "3px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700 }}>
                            {o.order_number}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                            Placed on {formatDate(o.created_at)} • {o.items.length} items
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "15px", fontWeight: 800 }}>
                              {formatCurrency(o.total_amount)}
                            </div>
                            <div style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: o.payment_status === "paid" ? "var(--accent-green)" : "#c85a17",
                              textTransform: "uppercase",
                            }}>
                              {o.payment_status} • {o.status}
                            </div>
                          </div>

                          <Link
                            href={`/checkout/track?order=${o.order_number}`}
                            className="btn-secondary"
                            style={{ padding: "6px 12px", fontSize: "11px", fontWeight: 700 }}
                          >
                            Track Live →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
