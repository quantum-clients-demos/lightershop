"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  TrendingUp,
  Package,
  Users,
  CheckCircle,
  XCircle,
  RefreshCw,
  PlusCircle,
  ShieldAlert,
  ArrowRight,
  ShoppingBag,
  Building2,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<number>(1);
  const [restockQty, setRestockQty] = useState<number>(50);
  const [restockMsg, setRestockMsg] = useState<string>("");

  const loadData = () => {
    setIsLoading(true);
    api
      .getAdminStats()
      .then(setStats)
      .catch((err) => console.error("Admin stats failed:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.restockProduct(selectedProduct, restockQty);
      setRestockMsg(`Successfully added ${restockQty} units to inventory!`);
      loadData();
      setTimeout(() => setRestockMsg(""), 3000);
    } catch (err: any) {
      setRestockMsg(err.message || "Restock failed");
    }
  };

  const handleReviewApplication = async (appId: number, status: string) => {
    try {
      await api.reviewApplication(appId, status);
      loadData();
    } catch (err) {
      console.error("Review application failed:", err);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      loadData();
    } catch (err) {
      console.error("Order status update failed:", err);
    }
  };

  return (
    <main className="container" style={{ padding: "36px 20px 80px 20px" }}>
      {/* Title & Action Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "32px",
      }}>
        <div>
          <div style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "var(--accent-spark)",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}>
            EXECUTIVE OVERVIEW
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 3.5vw, 36px)",
            fontWeight: 600,
            color: "var(--text-main)",
          }}>
            Operations Dashboard
          </h1>
        </div>

        <button
          onClick={loadData}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            fontWeight: 700,
            backgroundColor: "#ffffff",
            color: "var(--text-main)",
            border: "1px solid var(--border-light)",
            padding: "8px 16px",
            borderRadius: "2px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {isLoading && !stats ? (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          backgroundColor: "#ffffff",
          borderRadius: "4px",
          border: "1px solid var(--border-light)",
        }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-muted)" }}>
            Synchronizing live store metrics from Supabase PostgreSQL...
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Quick Jump Shortcuts */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}>
            <Link
              href="/admin/orders"
              style={{
                backgroundColor: "#ffffff",
                padding: "20px 24px",
                borderRadius: "4px",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(200, 90, 23, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-spark)",
                }}>
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                    Manage Orders & Shipping
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {stats?.total_orders_count || 0} total consignments
                  </div>
                </div>
              </div>
              <ArrowRight size={16} color="#aaa" />
            </Link>

            <Link
              href="/admin/products"
              style={{
                backgroundColor: "#ffffff",
                padding: "20px 24px",
                borderRadius: "4px",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(45, 138, 84, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-green)",
                }}>
                  <Package size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                    Inventory & Tiers
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {stats?.total_products_count || 6} models • {stats?.low_stock_products_count || 0} low stock
                  </div>
                </div>
              </div>
              <ArrowRight size={16} color="#aaa" />
            </Link>

            <Link
              href="/admin/wholesale"
              style={{
                backgroundColor: "#ffffff",
                padding: "20px 24px",
                borderRadius: "4px",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(17, 17, 17, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#111",
                }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                    B2B Wholesale Review
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {stats?.pending_wholesale_applications_count || 0} awaiting approval
                  </div>
                </div>
              </div>
              <ArrowRight size={16} color="#aaa" />
            </Link>
          </div>

          {/* KPI Cards Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}>
            <div style={{
              background: "#ffffff",
              padding: "24px",
              borderRadius: "4px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Total Paid Revenue
              </div>
              <div style={{ fontSize: "30px", fontWeight: 800, color: "var(--text-main)", marginTop: "6px" }}>
                {formatCurrency(stats?.total_revenue || 0)}
              </div>
              <div style={{ fontSize: "11px", color: "var(--accent-green)", marginTop: "6px", fontWeight: 600 }}>
                Captured via Razorpay Standard
              </div>
            </div>

            <div style={{
              background: "#ffffff",
              padding: "24px",
              borderRadius: "4px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Total Orders Placed
              </div>
              <div style={{ fontSize: "30px", fontWeight: 800, color: "var(--text-main)", marginTop: "6px" }}>
                {stats?.total_orders_count || 0}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                Retail: {stats?.retail_orders_count || 0} • Wholesale: {stats?.wholesale_orders_count || 0}
              </div>
            </div>

            <div style={{
              background: "#ffffff",
              padding: "24px",
              borderRadius: "4px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Pending B2B Applications
              </div>
              <div style={{
                fontSize: "30px",
                fontWeight: 800,
                color: (stats?.pending_wholesale_applications_count || 0) > 0 ? "var(--accent-spark)" : "var(--text-main)",
                marginTop: "6px",
              }}>
                {stats?.pending_wholesale_applications_count || 0}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                Verification & GSTIN review
              </div>
            </div>

            <div style={{
              background: "#ffffff",
              padding: "24px",
              borderRadius: "4px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Catalog Models (SKUs)
              </div>
              <div style={{ fontSize: "30px", fontWeight: 800, color: "var(--text-main)", marginTop: "6px" }}>
                {stats?.total_products_count || 6}
              </div>
              <div style={{ fontSize: "11px", color: (stats?.low_stock_products_count || 0) > 0 ? "var(--accent-spark)" : "var(--accent-green)", marginTop: "6px", fontWeight: 600 }}>
                {(stats?.low_stock_products_count || 0) > 0 ? `${stats.low_stock_products_count} models low on stock` : "All models healthy in stock"}
              </div>
            </div>
          </div>

          {/* Split Row: Wholesale Applications & Fast Restock Tool */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: "28px",
          }} className="admin-split-grid">
            {/* Wholesale Approvals Section */}
            <div style={{
              background: "#ffffff",
              padding: "28px",
              borderRadius: "4px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
                    Pending Wholesale Dealer Applications
                  </h2>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    Approving enables tier prices on the client account
                  </div>
                </div>
                <Link href="/admin/wholesale" style={{ fontSize: "12px", color: "var(--accent-spark)", fontWeight: 700 }}>
                  View All →
                </Link>
              </div>

              {(!stats?.pending_applications || stats.pending_applications.length === 0) ? (
                <div style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)", fontSize: "13px" }}>
                  No pending wholesale applications.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {stats.pending_applications.slice(0, 4).map((app: any) => (
                    <div
                      key={app.id}
                      style={{
                        border: "1px solid var(--border-light)",
                        borderRadius: "3px",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#faf8f4",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700 }}>
                          {app.business_name}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                          GSTIN: <strong>{app.gstin}</strong> • {app.contact_name} ({app.contact_phone})
                        </div>
                        <div style={{ fontSize: "11px", color: "#8a857d", marginTop: "2px" }}>
                          Est. Volume: {app.estimated_monthly_volume || "N/A"}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {app.status === "approved" ? (
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-green)" }}>
                            APPROVED
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleReviewApplication(app.id, "approved")}
                              style={{
                                background: "var(--accent-green)",
                                color: "#fff",
                                padding: "6px 12px",
                                fontSize: "11px",
                                fontWeight: 700,
                                borderRadius: "2px",
                              }}
                            >
                              APPROVE
                            </button>
                            <button
                              onClick={() => handleReviewApplication(app.id, "rejected")}
                              style={{
                                background: "#9b1c1c",
                                color: "#fff",
                                padding: "6px 12px",
                                fontSize: "11px",
                                fontWeight: 700,
                                borderRadius: "2px",
                              }}
                            >
                              REJECT
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fast Restock Tool */}
            <div style={{
              background: "#ffffff",
              padding: "28px",
              borderRadius: "4px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
                  Atomic Inventory Restock
                </h2>
                <Link href="/admin/products" style={{ fontSize: "12px", color: "var(--accent-spark)", fontWeight: 700 }}>
                  Stock Table →
                </Link>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>
                Replenish warehouse units with instant audit tracking to prevent overselling.
              </p>

              {restockMsg && (
                <div style={{
                  padding: "8px 12px",
                  background: "rgba(45, 138, 84, 0.12)",
                  color: "var(--accent-green)",
                  borderRadius: "3px",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "14px",
                }}>
                  {restockMsg}
                </div>
              )}

              <form onSubmit={handleRestock} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Select Lighter Model
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      fontSize: "13px",
                      background: "#fff",
                    }}
                  >
                    <option value={1}>Classic Steel (ID #1)</option>
                    <option value={2}>Midnight Black (ID #2)</option>
                    <option value={3}>Heritage Gold (ID #3)</option>
                    <option value={4}>Crimson Edition (ID #4)</option>
                    <option value={5}>Pocket Essential (ID #5)</option>
                    <option value={6}>Signature Black (ID #6)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Quantity to Add (Units)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={restockQty}
                    onChange={(e) => setRestockQty(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      fontSize: "13px",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "12px", width: "100%", marginTop: "6px" }}
                >
                  CONFIRM RESTOCK REPLENISHMENT
                </button>
              </form>
            </div>
          </div>

          {/* Orders Management Table */}
          <div style={{
            background: "#ffffff",
            padding: "28px",
            borderRadius: "4px",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
                  Recent Store Orders & Fulfillment
                </h2>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Live orders recorded across retail and wholesale sessions
                </div>
              </div>
              <Link href="/admin/orders" className="btn-secondary" style={{ padding: "8px 14px", fontSize: "12px" }}>
                Full Orders Registry →
              </Link>
            </div>

            {(!stats?.recent_orders || stats.recent_orders.length === 0) ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "13px" }}>
                No orders processed yet.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#f5f2ea", borderBottom: "1px solid var(--border-light)" }}>
                      <th style={{ padding: "10px 14px" }}>Order Number</th>
                      <th style={{ padding: "10px 14px" }}>Customer</th>
                      <th style={{ padding: "10px 14px" }}>Type</th>
                      <th style={{ padding: "10px 14px" }}>Amount</th>
                      <th style={{ padding: "10px 14px" }}>Payment</th>
                      <th style={{ padding: "10px 14px" }}>Fulfillment Status</th>
                      <th style={{ padding: "10px 14px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_orders.map((o: any) => (
                      <tr key={o.id} style={{ borderBottom: "1px solid #f0eae1" }}>
                        <td style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                          <Link href={`/checkout/track?order=${o.order_number}`} style={{ color: "var(--accent-spark)" }}>
                            {o.order_number}
                          </Link>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div>{o.customer_name}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{o.customer_email}</div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            borderRadius: "2px",
                            fontWeight: 700,
                            background: o.order_type === "wholesale" ? "rgba(200, 90, 23, 0.1)" : "#f0ece3",
                            color: o.order_type === "wholesale" ? "var(--accent-spark)" : "#141414",
                          }}>
                            {o.order_type.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", fontWeight: 700 }}>
                          {formatCurrency(o.total_amount)}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{
                            color: o.payment_status === "paid" ? "var(--accent-green)" : "#c85a17",
                            fontWeight: 700,
                            fontSize: "11px",
                          }}>
                            {o.payment_status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", textTransform: "capitalize" }}>
                          {o.status}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              border: "1px solid var(--border-light)",
                              borderRadius: "2px",
                              background: "#fff",
                            }}
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 860px) {
          .admin-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
