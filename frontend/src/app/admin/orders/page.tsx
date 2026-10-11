"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
  RefreshCw,
  ExternalLink,
  X,
  FileText,
  User,
  MapPin,
  Tag,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "retail" | "wholesale" | "paid" | "shipped" | "processing">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");

  const loadOrders = () => {
    setIsLoading(true);
    api
      .listAllOrders()
      .then(setOrders)
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setStatusUpdateMessage(`Order status updated to ${newStatus}`);
      setTimeout(() => setStatusUpdateMessage(""), 3000);
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_email.toLowerCase().includes(q) ||
          (o.customer_phone || "").toLowerCase().includes(q) ||
          (o.company_name || "").toLowerCase().includes(q)
      );
    }

    if (selectedFilter === "retail") {
      list = list.filter((o) => o.order_type === "retail");
    } else if (selectedFilter === "wholesale") {
      list = list.filter((o) => o.order_type === "wholesale");
    } else if (selectedFilter === "paid") {
      list = list.filter((o) => o.payment_status === "paid");
    } else if (selectedFilter === "shipped") {
      list = list.filter((o) => o.status === "shipped" || o.status === "delivered");
    } else if (selectedFilter === "processing") {
      list = list.filter((o) => o.status === "processing");
    }

    return list;
  }, [orders, searchQuery, selectedFilter]);

  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <main className="container" style={{ padding: "36px 20px 80px 20px" }}>
      {/* Page Title & Actions */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "28px",
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
            FULFILLMENT & DISPATCH
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 3.5vw, 36px)",
            fontWeight: 600,
            color: "var(--text-main)",
          }}>
            Orders & Shipping Registry
          </h1>
        </div>

        <button
          onClick={loadOrders}
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
          <span>Refresh Orders</span>
        </button>
      </div>

      {statusUpdateMessage && (
        <div style={{
          padding: "10px 16px",
          backgroundColor: "rgba(45, 138, 84, 0.12)",
          color: "var(--accent-green)",
          borderRadius: "3px",
          fontSize: "13px",
          fontWeight: 600,
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <CheckCircle2 size={16} />
          <span>{statusUpdateMessage}</span>
        </div>
      )}

      {/* Summary Stat Strips */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "28px",
      }}>
        <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Total Orders
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: "var(--text-main)" }}>
            {orders.length}
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Paid Order Turnover
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: "var(--accent-green)" }}>
            {formatCurrency(totalRevenue)}
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Wholesale Consignments
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: "var(--accent-spark)" }}>
            {orders.filter((o) => o.order_type === "wholesale").length}
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Retail Direct
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: "var(--text-main)" }}>
            {orders.filter((o) => o.order_type === "retail").length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border-light)",
        borderRadius: "4px",
        padding: "18px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {[
            { id: "all", label: `All (${orders.length})` },
            { id: "retail", label: "Retail Single" },
            { id: "wholesale", label: "Wholesale B2B" },
            { id: "paid", label: "Paid" },
            { id: "processing", label: "Processing" },
            { id: "shipped", label: "Dispatched" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              style={{
                padding: "7px 14px",
                fontSize: "12px",
                fontWeight: selectedFilter === tab.id ? 700 : 500,
                borderRadius: "2px",
                backgroundColor: selectedFilter === tab.id ? "#141414" : "#f4f1eb",
                color: selectedFilter === tab.id ? "#ffffff" : "var(--text-main)",
                border: "1px solid var(--border-light)",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          minWidth: "260px",
          flex: 1,
          maxWidth: "400px",
        }}>
          <Search size={15} style={{ position: "absolute", left: "12px", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search order #, customer, email, GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 34px",
              fontSize: "12px",
              border: "1px solid var(--border-light)",
              borderRadius: "2px",
              outline: "none",
              backgroundColor: "#faf9f6",
            }}
          />
        </div>
      </div>

      {/* Orders Data Table */}
      <div style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border-light)",
        borderRadius: "4px",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}>
        {isLoading && orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
            Loading orders registry...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
            No orders match the selected search or filter.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f5f2ea", borderBottom: "1px solid var(--border-light)" }}>
                  <th style={{ padding: "12px 16px" }}>Order Number</th>
                  <th style={{ padding: "12px 16px" }}>Customer & Company</th>
                  <th style={{ padding: "12px 16px" }}>Channel</th>
                  <th style={{ padding: "12px 16px" }}>Total Amount</th>
                  <th style={{ padding: "12px 16px" }}>Payment</th>
                  <th style={{ padding: "12px 16px" }}>Fulfillment Status</th>
                  <th style={{ padding: "12px 16px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid #f0eae1" }}>
                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                      <div style={{ color: "var(--text-main)" }}>{o.order_number}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400, marginTop: "2px" }}>
                        {formatDate(o.created_at)}
                      </div>
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{o.customer_email}</div>
                      {o.company_name && (
                        <div style={{ fontSize: "11px", color: "var(--accent-spark)", fontWeight: 600, marginTop: "2px" }}>
                          🏢 {o.company_name}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontSize: "10px",
                        padding: "3px 8px",
                        borderRadius: "2px",
                        fontWeight: 800,
                        background: o.order_type === "wholesale" ? "rgba(200, 90, 23, 0.1)" : "#f0ece3",
                        color: o.order_type === "wholesale" ? "var(--accent-spark)" : "#141414",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}>
                        {o.order_type === "wholesale" ? <Building2 size={11} /> : <User size={11} />}
                        {o.order_type.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: "14px 16px", fontWeight: 700 }}>
                      {formatCurrency(o.total_amount)}
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>
                        {o.items?.length || 0} line items
                      </div>
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        color: o.payment_status === "paid" ? "var(--accent-green)" : "#c85a17",
                        fontWeight: 700,
                        fontSize: "11px",
                        background: o.payment_status === "paid" ? "rgba(45, 138, 84, 0.1)" : "rgba(200, 90, 23, 0.1)",
                        padding: "3px 8px",
                        borderRadius: "2px",
                      }}>
                        {o.payment_status.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        style={{
                          padding: "6px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          border: "1px solid var(--border-light)",
                          borderRadius: "2px",
                          background: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                          onClick={() => setSelectedOrder(o)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "11px",
                            fontWeight: 700,
                            background: "#f0ece3",
                            border: "1px solid var(--border-light)",
                            borderRadius: "2px",
                            color: "var(--text-main)",
                          }}
                        >
                          Details
                        </button>
                        <Link
                          href={`/checkout/track?order=${o.order_number}`}
                          target="_blank"
                          title="Open Live Public Stepper"
                          style={{
                            padding: "6px",
                            color: "var(--text-muted)",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Slide-Out Modal */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(18, 16, 14, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 1100,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "520px",
              height: "100%",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-dark)",
              animation: "slideInRight 0.3s var(--ease-smooth)",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "24px 28px",
              borderBottom: "1px solid var(--border-light)",
              backgroundColor: "#f7f5f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--accent-spark)", fontWeight: 700, letterSpacing: "0.1em" }}>
                  CONSIGNMENT DOSSIER
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "18px", fontWeight: 800, marginTop: "2px" }}>
                  {selectedOrder.order_number}
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: "#ebe5db",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable details content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
              {/* Customer Box */}
              <div style={{
                backgroundColor: "#faf9f6",
                border: "1px solid var(--border-light)",
                borderRadius: "3px",
                padding: "16px",
                marginBottom: "20px",
              }}>
                <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                  Client Profile
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>{selectedOrder.customer_name}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {selectedOrder.customer_email} • {selectedOrder.customer_phone}
                </div>
                {selectedOrder.company_name && (
                  <div style={{ fontSize: "12px", color: "var(--accent-spark)", marginTop: "6px", fontWeight: 600 }}>
                    🏢 {selectedOrder.company_name} (GSTIN: {selectedOrder.gstin || "N/A"})
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div style={{
                backgroundColor: "#faf9f6",
                border: "1px solid var(--border-light)",
                borderRadius: "3px",
                padding: "16px",
                marginBottom: "20px",
              }}>
                <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                  Delivery Destination
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-main)", lineHeight: 1.5 }}>
                  {selectedOrder.shipping_address}
                </div>
                {selectedOrder.notes && (
                  <div style={{ fontSize: "12px", color: "#8a857d", marginTop: "8px", fontStyle: "italic" }}>
                    Notes: &ldquo;{selectedOrder.notes}&rdquo;
                  </div>
                )}
              </div>

              {/* Items List */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "12px" }}>
                  Ordered Items ({selectedOrder.items?.length || 0})
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "12px",
                        border: "1px solid var(--border-light)",
                        borderRadius: "2px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700 }}>{item.product_name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {item.quantity} units @ {formatCurrency(item.unit_price)}/unit
                        </div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 700 }}>
                        {formatCurrency(item.total_price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div style={{
                borderTop: "1px solid var(--border-light)",
                paddingTop: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "13px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-spark)" }}>
                    <span>Discount</span>
                    <span>-{formatCurrency(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                  <span>GST (18%)</span>
                  <span>{formatCurrency(selectedOrder.tax_amount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                  <span>Express Shipping</span>
                  <span>{selectedOrder.shipping_amount === 0 ? "FREE" : formatCurrency(selectedOrder.shipping_amount)}</span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  fontWeight: 800,
                  borderTop: "1px solid #e0dbd1",
                  paddingTop: "10px",
                  marginTop: "4px",
                }}>
                  <span>Total Paid</span>
                  <span>{formatCurrency(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "20px 28px", borderTop: "1px solid var(--border-light)", backgroundColor: "#f9f8f4" }}>
              <Link
                href={`/checkout/track?order=${selectedOrder.order_number}`}
                target="_blank"
                className="btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "12px", justifyContent: "center" }}
              >
                OPEN PUBLIC CONSIGNMENT TRACKER ↗
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
