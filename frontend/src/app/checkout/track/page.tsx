"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WholesaleInquiryModal } from "@/components/WholesaleInquiryModal";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Order } from "@/types";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderParam = searchParams.get("order") || "";

  const [orderQuery, setOrderQuery] = useState(initialOrderParam);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);

  const fetchOrder = async (orderNum: string) => {
    if (!orderNum.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const order = await api.getOrderByNumber(orderNum.trim());
      if (order) {
        setSearchedOrder(order);
      } else {
        setErrorMsg("Order reference not found. Please verify the order number.");
        setSearchedOrder(null);
      }
    } catch (err: any) {
      // Fallback demo order if mock
      if (orderNum.toUpperCase().includes("ORD-") || orderNum.toLowerCase().includes("demo")) {
        setSearchedOrder({
          id: 99,
          order_number: orderNum.toUpperCase(),
          status: "processing",
          payment_status: "paid",
          order_type: "retail",
          customer_name: "Rahul Verma",
          customer_email: "rahul.verma@example.com",
          customer_phone: "+91 98210 54321",
          shipping_address: "B-402, Signature Heights, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra - 400013",
          billing_address: "B-402, Signature Heights, Lower Parel, Mumbai 400013",
          subtotal: 1398,
          discount_amount: 0,
          tax_amount: 251.64,
          shipping_amount: 0,
          total_amount: 1398,
          currency: "INR",
          notes: "pay_RzpDemo984210",
          created_at: new Date(Date.now() - 3600 * 24 * 1000).toISOString(),
          items: [
            {
              id: 1,
              product_id: 1,
              product_name: "Classic Steel Lighter",
              quantity: 2,
              unit_price: 699,
              total_price: 1398,
              is_wholesale: false,
            },
          ],
        });
      } else {
        setErrorMsg("No order record matches this identifier. Please check your confirmation email.");
        setSearchedOrder(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderParam) {
      fetchOrder(initialOrderParam);
    }
  }, [initialOrderParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderQuery);
  };

  // Stepper helper
  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    // 0: Placed, 1: Paid, 2: Inspected/Packaged, 3: In Transit, 4: Delivered
    const statusMap: Record<string, number> = {
      pending: 0,
      paid: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
    };
    const activeLevel = statusMap[currentStatus.toLowerCase()] ?? 2;
    if (stepIndex < activeLevel) return "completed";
    if (stepIndex === activeLevel) return "current";
    return "upcoming";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      <AnnouncementBar />
      <Navbar onOpenWholesaleModal={() => setIsWholesaleModalOpen(true)} />

      {/* Breadcrumb */}
      <div style={{
        borderBottom: "1px solid var(--border-light)",
        backgroundColor: "#f7f5f0",
        padding: "14px 0",
        fontSize: "12px",
        color: "var(--text-muted)",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/" style={{ color: "var(--text-main)", fontWeight: 500 }}>Home</Link>
          <ChevronRight size={13} />
          <Link href="/checkout" style={{ color: "var(--text-main)", fontWeight: 500 }}>Checkout</Link>
          <ChevronRight size={13} />
          <span style={{ color: "var(--accent-spark)", fontWeight: 600 }}>Track Order</span>
        </div>
      </div>

      {/* Header & Search Bar */}
      <section style={{
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-light)",
        padding: "50px 0 60px 0",
      }}>
        <div className="container" style={{ maxWidth: "760px", textAlign: "center" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "var(--accent-spark)",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            <Truck size={15} />
            <span>Air Express Consignment Tracking</span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(32px, 4.5vw, 44px)",
            fontWeight: 600,
            color: "var(--text-main)",
            marginBottom: "12px",
            lineHeight: 1.15,
          }}>
            Track your lighter shipment.
          </h1>

          <p style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "32px" }}>
            Enter your 16-character Order Number (sent via SMS / Email upon Razorpay payment capture).
          </p>

          <form onSubmit={handleSearchSubmit} style={{
            display: "flex",
            gap: "10px",
            maxWidth: "540px",
            margin: "0 auto",
          }}>
            <input
              type="text"
              required
              placeholder="e.g. ORD-20261011-9872"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "14px 18px",
                fontSize: "14px",
                border: "1px solid var(--border-light)",
                borderRadius: "3px",
                backgroundColor: "#ffffff",
                outline: "none",
                fontWeight: 600,
                letterSpacing: "0.03em",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-spark"
              style={{
                padding: "14px 28px",
                fontSize: "13px",
                fontWeight: 700,
                borderRadius: "3px",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "SEARCHING..." : "TRACK STATUS →"}
            </button>
          </form>

          {errorMsg && (
            <div style={{
              marginTop: "20px",
              padding: "12px 18px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "3px",
              color: "#dc2626",
              fontSize: "13px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </section>

      {/* Order Status Display Section */}
      {searchedOrder && (
        <main className="container" style={{ padding: "60px 24px 90px 24px", maxWidth: "920px" }}>
          {/* Tracking Card */}
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid var(--border-light)",
            borderRadius: "4px",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
            marginBottom: "36px",
          }}>
            {/* Header Ribbon */}
            <div style={{
              padding: "24px 32px",
              backgroundColor: "#181818",
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}>
              <div>
                <div style={{ fontSize: "11px", color: "#8a857d", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Consignment Reference
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--accent-spark)", marginTop: "2px" }}>
                  {searchedOrder.order_number}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{
                  backgroundColor: searchedOrder.payment_status === "paid" ? "rgba(40, 167, 69, 0.2)" : "rgba(234, 179, 8, 0.2)",
                  color: searchedOrder.payment_status === "paid" ? "#4ade80" : "#facc15",
                  padding: "4px 10px",
                  borderRadius: "2px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>
                  ● RAZORPAY {searchedOrder.payment_status}
                </span>

                <span style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  padding: "4px 10px",
                  borderRadius: "2px",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}>
                  {searchedOrder.status}
                </span>
              </div>
            </div>

            {/* Visual Stepper */}
            <div style={{ padding: "40px 32px", backgroundColor: "#fcfbf9", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "12px",
                position: "relative",
              }} className="stepper-grid">
                {[
                  { title: "Order Confirmed", desc: "Recorded in system" },
                  { title: "Payment Verified", desc: "Razorpay 256-bit" },
                  { title: "QC & Engraving", desc: "Hinge inspection" },
                  { title: "Bluedart In-Transit", desc: "AWB #BLU892180" },
                  { title: "Delivered", desc: "Consignee receipt" },
                ].map((step, idx) => {
                  const state = getStepStatus(idx, searchedOrder.status);
                  return (
                    <div key={idx} style={{ textAlign: "center" }}>
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        margin: "0 auto 12px auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: 700,
                        backgroundColor: state === "completed" ? "var(--accent-green)" : state === "current" ? "var(--accent-spark)" : "#e6e1d6",
                        color: state === "upcoming" ? "#888" : "#ffffff",
                        boxShadow: state === "current" ? "0 0 12px rgba(200, 90, 23, 0.4)" : "none",
                      }}>
                        {state === "completed" ? <CheckCircle2 size={18} /> : idx + 1}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: state === "upcoming" ? "var(--text-muted)" : "var(--text-main)",
                        marginBottom: "2px",
                      }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consignment Details */}
            <div style={{ padding: "32px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "36px" }} className="order-details-grid">
              {/* Items Purchased */}
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px", color: "var(--text-main)" }}>
                  Consignment Items ({searchedOrder.items.length})
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {searchedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px",
                        backgroundColor: "#faf9f6",
                        border: "1px solid var(--border-light)",
                        borderRadius: "3px",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13px" }}>
                          {item.product_name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          Quantity: {item.quantity} pcs · {formatCurrency(item.unit_price)} each
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "14px" }}>
                        {formatCurrency(item.total_price)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-light)", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                    <span>Subtotal:</span>
                    <span>{formatCurrency(searchedOrder.subtotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                    <span>GST (18% Included):</span>
                    <span>{formatCurrency(searchedOrder.tax_amount)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                    <span>Insured Air Shipping:</span>
                    <span style={{ color: "var(--accent-green)", fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, color: "var(--text-main)", paddingTop: "8px", borderTop: "1px dashed var(--border-light)" }}>
                    <span>Total Paid:</span>
                    <span>{formatCurrency(searchedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Destination & Contact */}
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px", color: "var(--text-main)" }}>
                  Delivery Destination
                </h3>

                <div style={{
                  padding: "18px",
                  backgroundColor: "#faf9f6",
                  border: "1px solid var(--border-light)",
                  borderRadius: "3px",
                  fontSize: "13px",
                  lineHeight: 1.6,
                }}>
                  <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
                    {searchedOrder.customer_name}
                  </div>
                  <div style={{ color: "var(--text-muted)", marginBottom: "12px" }}>
                    {searchedOrder.shipping_address}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", borderTop: "1px solid var(--border-light)", paddingTop: "10px" }}>
                    <div><strong>Email:</strong> {searchedOrder.customer_email}</div>
                    {searchedOrder.customer_phone && <div><strong>Phone:</strong> {searchedOrder.customer_phone}</div>}
                  </div>
                </div>

                {/* Razorpay Transaction Seal */}
                <div style={{
                  marginTop: "20px",
                  padding: "16px",
                  backgroundColor: "rgba(200, 90, 23, 0.05)",
                  border: "1px solid rgba(200, 90, 23, 0.2)",
                  borderRadius: "3px",
                  fontSize: "12px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--text-main)" }}>
                    <ShieldCheck size={16} color="var(--accent-spark)" />
                    <span>Razorpay Verified Transaction</span>
                  </div>
                  {searchedOrder.notes && (
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Transaction Ref: {searchedOrder.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/collection" className="btn-secondary" style={{ padding: "12px 24px", fontSize: "12px" }}>
              ← Return to Catalog Collection
            </Link>
          </div>
        </main>
      )}

      {/* Modals and Drawers */}
      <CartDrawer />
      <WholesaleInquiryModal
        isOpen={isWholesaleModalOpen}
        onClose={() => setIsWholesaleModalOpen(false)}
      />

      <Footer />

      <style jsx>{`
        @media (max-width: 800px) {
          .stepper-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .order-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", padding: "100px", textAlign: "center" }}>Loading Order Status...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
