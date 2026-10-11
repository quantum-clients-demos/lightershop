"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/cartStore";
import { useAuth } from "@/features/auth/authStore";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/formatters";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { ArrowLeft, ShieldCheck, Lock, CreditCard, Sparkles, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, quote, storeMode, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    customer_name: user?.full_name || "Ashutosh Sharma",
    customer_email: user?.email || "ashutosh@example.com",
    customer_phone: user?.phone || "+91 9876543210",
    shipping_address: "Flat 402, Signature Towers, MG Road, Gurugram, Haryana - 122002",
    company_name: user?.company_name || (storeMode === "wholesale" ? "Sharma Retail & Living LLP" : ""),
    gstin: user?.gstin || (storeMode === "wholesale" ? "07AAAAA0000A1Z5" : ""),
    notes: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (items.length === 0) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>
        <div style={{
          backgroundColor: "#ffffff",
          padding: "48px 40px",
          borderRadius: "4px",
          boxShadow: "var(--shadow-md)",
          textAlign: "center",
          maxWidth: "460px",
          width: "100%",
        }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", marginBottom: "12px" }}>Your Bag is Empty</h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "28px" }}>
            Please select your desired lighters before proceeding to checkout.
          </p>
          <Link href="/#collection" className="btn-primary" style={{ padding: "14px 28px" }}>
            RETURN TO SHOP
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage("");

    try {
      // 1. Create order on FastAPI backend
      const orderPayload = {
        items: items.map((i) => ({
          product_id: i.productId,
          quantity: i.quantity,
          mode: i.mode || storeMode,
        })),
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: formData.shipping_address,
        company_name: formData.company_name,
        gstin: formData.gstin,
        order_type: storeMode,
        notes: formData.notes,
      };

      const order = await api.createOrder(orderPayload);

      // 2. Create Razorpay order on backend
      const rzpOrderData = await api.createRazorpayOrder(order.id);

      // 3. Trigger Razorpay Standard Checkout popup
      await openRazorpayCheckout({
        orderData: rzpOrderData,
        orderId: order.id,
        onSuccess: (paymentResult) => {
          clearCart();
          router.push(`/checkout/success?order_number=${order.order_number}`);
        },
        onError: (err) => {
          console.error("Payment error:", err);
          setErrorMessage(err.message || "Payment could not be completed. Please try again.");
          setIsProcessing(false);
        },
        onDismiss: () => {
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      console.error("Checkout submission failed:", err);
      setErrorMessage(err.message || "Could not initialize checkout. Please verify your details.");
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border-light)",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
      }}>
        <div className="container" style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link href="/" style={{
            fontFamily: "var(--font-mono)",
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "0.16em",
            color: "var(--text-main)",
          }}>
            EMBER&CO.
          </Link>

          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="container" style={{ padding: "48px 24px 80px 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "48px",
          alignItems: "flex-start",
        }} className="checkout-grid">
          {/* Left: Customer & Address Form */}
          <div style={{
            backgroundColor: "#ffffff",
            padding: "36px",
            borderRadius: "4px",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <h1 style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "26px",
                  fontWeight: 600,
                  color: "var(--text-main)",
                }}>
                  Express Checkout
                </h1>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Step 1 of 2: Shipping & Tax Invoicing
                </div>
              </div>

              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                color: storeMode === "wholesale" ? "var(--accent-spark)" : "#141414",
                background: storeMode === "wholesale" ? "rgba(200, 90, 23, 0.1)" : "#f0ece3",
                padding: "6px 12px",
                borderRadius: "3px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                {storeMode === "wholesale" ? "B2B WHOLESALE ORDER" : "RETAIL ORDER"}
              </div>
            </div>

            {errorMessage && (
              <div style={{
                padding: "12px 16px",
                background: "#fde8e8",
                color: "#9b1c1c",
                borderRadius: "3px",
                fontSize: "13px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Contact Information */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "12px" }}>
                  Contact Information
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }} className="checkout-two-col">
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        border: "1px solid var(--border-light)",
                        borderRadius: "2px",
                        fontSize: "13px",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                      Phone (for Delivery SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        border: "1px solid var(--border-light)",
                        borderRadius: "2px",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "14px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Email Address (for Razorpay Receipt & Invoice) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      fontSize: "13px",
                    }}
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "12px" }}>
                  Delivery Address
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                    Shipping Address with PIN Code *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.shipping_address}
                    onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  />
                </div>
              </div>

              {/* B2B / Wholesale Tax Fields */}
              <div style={{
                background: storeMode === "wholesale" ? "rgba(200, 90, 23, 0.05)" : "#f9f8f6",
                padding: "18px",
                borderRadius: "3px",
                border: "1px solid var(--border-light)",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                    Business Tax Invoicing (GST Input Credit)
                  </div>
                  {storeMode === "wholesale" && (
                    <span style={{ fontSize: "10px", background: "var(--accent-spark)", color: "#fff", padding: "2px 6px", borderRadius: "2px", fontWeight: 700 }}>
                      REQUIRED FOR WHOLESALE
                    </span>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }} className="checkout-two-col">
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                      Registered Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "9px 10px",
                        border: "1px solid var(--border-light)",
                        borderRadius: "2px",
                        fontSize: "12px",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                      GSTIN (15 characters)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 27AABCU9603R1ZM"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                      style={{
                        width: "100%",
                        padding: "9px 10px",
                        border: "1px solid var(--border-light)",
                        borderRadius: "2px",
                        fontSize: "12px",
                        fontFamily: "var(--font-mono)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Special Delivery Instructions / Packaging Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave with security / Fragile collectible gift packaging"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-light)",
                    borderRadius: "2px",
                    fontSize: "13px",
                  }}
                />
              </div>

              {/* Razorpay Launch Button */}
              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  backgroundColor: "#141414",
                  color: "#ffffff",
                  padding: "18px",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "12px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                <CreditCard size={18} color="var(--accent-spark)" />
                <span>
                  {isProcessing
                    ? "PREPARING RAZORPAY CHECKOUT..."
                    : `PAY ${formatCurrency(quote?.total_amount || 0)} VIA RAZORPAY`}
                </span>
              </button>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                fontSize: "11px",
                color: "var(--text-muted)",
                marginTop: "4px",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Lock size={12} /> Razorpay Verified
                </span>
                <span>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShieldCheck size={12} /> 100% Buyer Protection
                </span>
                <span>•</span>
                <span>GST Tax Compliant</span>
              </div>
            </form>
          </div>

          {/* Right: Order Summary Breakdown */}
          <div style={{
            backgroundColor: "#ffffff",
            padding: "32px",
            borderRadius: "4px",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)",
          }}>
            <h2 style={{
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: "var(--text-main)",
              marginBottom: "20px",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: "12px",
            }}>
              Order Items ({items.reduce((s, i) => s + i.quantity, 0)} units)
            </h2>

            {/* Items list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {items.map((item) => {
                const itemQuote = quote?.items.find((qi) => qi.product_id === item.productId);
                const unitPrice = itemQuote?.unit_price || (item.mode === "wholesale" ? item.product.wholesale_price : item.product.retail_price);
                const lineTotal = itemQuote?.total_price || unitPrice * item.quantity;

                return (
                  <div key={item.productId} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <div style={{
                      position: "relative",
                      width: "56px",
                      height: "64px",
                      backgroundColor: "var(--bg-podium)",
                      borderRadius: "2px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}>
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {item.quantity} × {formatCurrency(unitPrice)}
                        {item.mode === "wholesale" && " (Wholesale pack)"}
                      </div>
                    </div>

                    <div style={{ fontSize: "14px", fontWeight: 700 }}>
                      {formatCurrency(lineTotal)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Financials Breakdown */}
            <div style={{
              borderTop: "1px solid var(--border-light)",
              paddingTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "13px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>Item Subtotal</span>
                <span>{formatCurrency(quote?.subtotal || 0)}</span>
              </div>

              {quote && quote.wholesale_savings > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-green)", fontWeight: 600 }}>
                  <span>Wholesale Discount</span>
                  <span>-{formatCurrency(quote.wholesale_savings)}</span>
                </div>
              )}

              {quote && quote.discount_amount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-spark)", fontWeight: 600 }}>
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(quote.discount_amount)}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>GST (18% Indian Tax)</span>
                <span>{formatCurrency(quote?.tax_amount || 0)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>Express Shipping</span>
                <span>{quote?.shipping_amount === 0 ? "FREE" : formatCurrency(quote?.shipping_amount || 0)}</span>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "20px",
                fontWeight: 800,
                color: "var(--text-main)",
                borderTop: "1px solid #e2ddd3",
                paddingTop: "14px",
                marginTop: "6px",
              }}>
                <span>Total Payable</span>
                <span>{formatCurrency(quote?.total_amount || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 860px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
        @media (max-width: 600px) {
          .checkout-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
