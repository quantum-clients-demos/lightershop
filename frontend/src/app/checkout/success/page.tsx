"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";
import confetti from "canvas-confetti";
import { CheckCircle2, PackageCheck, Printer, ArrowRight, ShieldCheck } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_number") || "";
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fire festive confetti animation
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#c85a17", "#d4af37", "#141414", "#ffffff"],
    });

    if (orderNumber) {
      api
        .getOrderByNumber(orderNumber)
        .then((o) => setOrder(o))
        .catch((err) => console.error("Could not fetch order:", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [orderNumber]);

  return (
    <div style={{
      maxWidth: "680px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      padding: "48px 40px",
      borderRadius: "4px",
      border: "1px solid var(--border-light)",
      boxShadow: "var(--shadow-md)",
      textAlign: "center",
    }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "72px",
        height: "72px",
        borderRadius: "50%",
        backgroundColor: "rgba(45, 138, 84, 0.1)",
        color: "var(--accent-green)",
        marginBottom: "20px",
      }}>
        <CheckCircle2 size={42} />
      </div>

      <div style={{
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--accent-spark)",
        marginBottom: "8px",
      }}>
        PAYMENT COMPLETED & VERIFIED
      </div>

      <h1 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "32px",
        fontWeight: 600,
        color: "var(--text-main)",
        marginBottom: "12px",
      }}>
        Thank you for your order!
      </h1>

      <p style={{
        fontSize: "14px",
        color: "var(--text-muted)",
        maxWidth: "460px",
        margin: "0 auto 28px auto",
        lineHeight: 1.6,
      }}>
        Your transaction has been securely captured via Razorpay. We are now preparing your precision lighter package for dispatch.
      </p>

      {/* Order Reference Box */}
      <div style={{
        backgroundColor: "var(--bg-subtle)",
        padding: "20px",
        borderRadius: "4px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        textAlign: "left",
        marginBottom: "32px",
        fontSize: "13px",
      }}>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase", fontWeight: 600 }}>
            Order Reference
          </div>
          <div style={{ fontWeight: 800, fontFamily: "var(--font-mono)", fontSize: "15px", color: "var(--text-main)", marginTop: "2px" }}>
            {order?.order_number || orderNumber || "EMB-2026-CONFIRMED"}
          </div>
        </div>

        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase", fontWeight: 600 }}>
            Order Type / Payment
          </div>
          <div style={{ fontWeight: 700, color: "var(--accent-green)", marginTop: "2px" }}>
            {order?.order_type === "wholesale" ? "Wholesale B2B (Paid)" : "Retail Standard (Paid)"}
          </div>
        </div>

        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase", fontWeight: 600 }}>
            Total Amount Paid
          </div>
          <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--text-main)", marginTop: "2px" }}>
            {order ? formatCurrency(order.total_amount) : "₹--"}
          </div>
        </div>

        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase", fontWeight: 600 }}>
            Estimated Delivery
          </div>
          <div style={{ fontWeight: 600, color: "var(--text-main)", marginTop: "2px" }}>
            3-5 Business Days (Bluedart Express)
          </div>
        </div>
      </div>

      {/* Shipping destination summary */}
      {order && (
        <div style={{
          textAlign: "left",
          borderTop: "1px solid var(--border-light)",
          paddingTop: "24px",
          marginBottom: "32px",
          fontSize: "13px",
        }}>
          <div style={{ fontWeight: 700, marginBottom: "4px" }}>
            Shipping to: {order.customer_name} ({order.customer_phone})
          </div>
          <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
            {order.shipping_address}
          </div>
          {order.gstin && (
            <div style={{ fontSize: "12px", color: "var(--accent-spark)", marginTop: "6px", fontWeight: 600 }}>
              B2B GSTIN: {order.gstin} · Tax invoice emailed to {order.customer_email}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          href={`/checkout/track?order=${order?.order_number || orderNumber}`}
          className="btn-spark"
          style={{ padding: "14px 24px" }}
        >
          <span>TRACK SHIPMENT LIVE →</span>
        </Link>

        <Link
          href="/"
          className="btn-primary"
          style={{ padding: "14px 24px" }}
        >
          <span>CONTINUE SHOPPING</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="btn-secondary"
          style={{ padding: "14px 20px" }}
        >
          <Printer size={15} />
          <span>RECEIPT</span>
        </button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary)",
      padding: "60px 20px 100px 20px",
    }}>
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <Link href="/" style={{
          fontFamily: "var(--font-mono)",
          fontSize: "22px",
          fontWeight: 800,
          letterSpacing: "0.18em",
          color: "var(--text-main)",
        }}>
          EMBER&CO.
        </Link>
      </header>

      <Suspense fallback={<div style={{ textAlign: "center" }}>Loading order details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
