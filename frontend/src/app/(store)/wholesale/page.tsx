"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WholesaleInquiryModal } from "@/components/WholesaleInquiryModal";
import { useCart } from "@/features/cart/cartStore";
import { formatCurrency } from "@/lib/formatters";
import { api } from "@/lib/api";
import {
  Building2,
  Percent,
  TrendingUp,
  FileText,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  ChevronRight,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ProductModel {
  name: string;
  slug: string;
  retailPrice: number;
  tiers: { minQty: number; unitPrice: number; label: string }[];
}

const wholesaleCatalog: ProductModel[] = [
  {
    name: "Classic Steel",
    slug: "classic-steel",
    retailPrice: 699,
    tiers: [
      { minQty: 20, unitPrice: 420, label: "Starter Pack (20+ pcs)" },
      { minQty: 50, unitPrice: 380, label: "Master Carton (50+ pcs)" },
      { minQty: 100, unitPrice: 340, label: "Distributor Pallet (100+ pcs)" },
    ],
  },
  {
    name: "Midnight Black",
    slug: "midnight-black",
    retailPrice: 899,
    tiers: [
      { minQty: 20, unitPrice: 540, label: "Starter Pack (20+ pcs)" },
      { minQty: 50, unitPrice: 490, label: "Master Carton (50+ pcs)" },
      { minQty: 100, unitPrice: 440, label: "Distributor Pallet (100+ pcs)" },
    ],
  },
  {
    name: "Heritage Gold",
    slug: "heritage-gold",
    retailPrice: 1299,
    tiers: [
      { minQty: 15, unitPrice: 780, label: "Boutique Display (15+ pcs)" },
      { minQty: 50, unitPrice: 710, label: "Wholesale Carton (50+ pcs)" },
      { minQty: 100, unitPrice: 650, label: "Distributor Pallet (100+ pcs)" },
    ],
  },
  {
    name: "Crimson Edition",
    slug: "crimson-edition",
    retailPrice: 999,
    tiers: [
      { minQty: 20, unitPrice: 600, label: "Starter Pack (20+ pcs)" },
      { minQty: 50, unitPrice: 540, label: "Master Carton (50+ pcs)" },
      { minQty: 100, unitPrice: 490, label: "Distributor Pallet (100+ pcs)" },
    ],
  },
  {
    name: "Pocket Essential",
    slug: "pocket-essential",
    retailPrice: 549,
    tiers: [
      { minQty: 25, unitPrice: 330, label: "Retail Tray (25+ pcs)" },
      { minQty: 50, unitPrice: 290, label: "Carton Bulk (50+ pcs)" },
      { minQty: 100, unitPrice: 260, label: "Wholesale Case (100+ pcs)" },
    ],
  },
  {
    name: "Signature Black",
    slug: "signature-black",
    retailPrice: 1499,
    tiers: [
      { minQty: 10, unitPrice: 900, label: "Club Pack (10+ pcs)" },
      { minQty: 30, unitPrice: 820, label: "Executive Carton (30+ pcs)" },
      { minQty: 75, unitPrice: 750, label: "Master Dealer (75+ pcs)" },
    ],
  },
];

export default function WholesalePage() {
  const { addItem, setStoreMode } = useCart();
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);

  // Calculator state
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const [orderQty, setOrderQty] = useState(50);

  // Application form state
  const [form, setForm] = useState({
    business_name: "",
    contact_name: "",
    email: "",
    phone: "",
    city: "",
    gstin: "",
    estimated_volume: "50-100",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const currentProduct = wholesaleCatalog[selectedProductIdx];

  // Calculate unit price from tiers
  let unitCost = currentProduct.tiers[0].unitPrice;
  let activeTierLabel = currentProduct.tiers[0].label;
  for (const t of currentProduct.tiers) {
    if (orderQty >= t.minQty) {
      unitCost = t.unitPrice;
      activeTierLabel = t.label;
    }
  }

  const totalWholesaleInvestment = unitCost * orderQty;
  const totalRetailRevenue = currentProduct.retailPrice * orderQty;
  const grossProfit = totalRetailRevenue - totalWholesaleInvestment;
  const grossMarginPercent = Math.round((grossProfit / totalRetailRevenue) * 100);

  const handleAddCartonToCart = () => {
    setStoreMode("wholesale");
    // Create product placeholder for cart
    const dummyProduct: any = {
      id: selectedProductIdx + 1,
      name: currentProduct.name,
      slug: currentProduct.slug,
      retail_price: currentProduct.retailPrice,
      wholesale_price: unitCost,
      min_wholesale_qty: currentProduct.tiers[0].minQty,
      image_url: `/images/${currentProduct.slug}.png`,
      finish: "Wholesale Carton",
      stock_quantity: 500,
    };
    addItem(dummyProduct, orderQty, "wholesale");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await api.submitWholesaleApplication({
        business_name: form.business_name,
        contact_name: form.contact_name,
        contact_email: form.email,
        contact_phone: form.phone,
        gstin: form.gstin || "PENDING",
        business_type: "Retailer / Distributor",
        estimated_monthly_volume: form.estimated_volume,
        notes: form.message,
      });
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to submit application. Please check details.");
    } finally {
      setIsSubmitting(false);
    }
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
          <span style={{ color: "var(--accent-spark)", fontWeight: 600 }}>B2B Wholesale Portal</span>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-light)",
        padding: "60px 0 70px 0",
      }}>
        <div className="container">
          <div style={{ maxWidth: "800px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "var(--accent-spark)",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}>
              <Building2 size={16} />
              <span>Official Distributor & Dealer Program</span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 5vw, 52px)",
              fontWeight: 600,
              color: "var(--text-main)",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}>
              High-margin precision lighters for select retailers.
            </h1>

            <p style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "var(--text-muted)",
              marginBottom: "32px",
            }}>
              Partner with Ember & Co. to supply premium mechanical pocket lighters to boutiques, cigar lounges, lifestyle stores, and corporate gifting houses. Benefit from tiered volume pricing, input GST invoices, and 24-hour dispatch.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a href="#calculator" className="btn-spark" style={{ padding: "14px 28px", fontSize: "13px" }}>
                Calculate Retail Margins ↓
              </a>
              <a
                href="#apply"
                className="btn-secondary"
                style={{ padding: "14px 28px", fontSize: "13px" }}
              >
                Apply for Wholesale Account
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Wholesale Advantage */}
      <section style={{ padding: "70px 0", borderBottom: "1px solid var(--border-light)", backgroundColor: "#ffffff" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 50px auto" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent-spark)", textTransform: "uppercase" }}>
              Commercial Advantages
            </span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 600, color: "var(--text-main)", marginTop: "6px" }}>
              Built for robust retail profitability.
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
          }} className="benefits-grid">
            <div style={{
              padding: "32px 24px",
              border: "1px solid var(--border-light)",
              borderRadius: "4px",
              backgroundColor: "var(--bg-surface)",
            }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "4px",
                backgroundColor: "rgba(200, 90, 23, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}>
                <Percent size={22} color="var(--accent-spark)" />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                40% to 55% Margin
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Protected retail MSRP preserves your brand margins while volume break tiers reward high-turnover retailers.
              </p>
            </div>

            <div style={{
              padding: "32px 24px",
              border: "1px solid var(--border-light)",
              borderRadius: "4px",
              backgroundColor: "var(--bg-surface)",
            }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "4px",
                backgroundColor: "rgba(200, 90, 23, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}>
                <FileText size={22} color="var(--accent-spark)" />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                18% Input GST Credit
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Every consignment includes a B2B Tax Invoice with your GSTIN and HSN 9613 codes for seamless input credit reconciliation.
              </p>
            </div>

            <div style={{
              padding: "32px 24px",
              border: "1px solid var(--border-light)",
              borderRadius: "4px",
              backgroundColor: "var(--bg-surface)",
            }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "4px",
                backgroundColor: "rgba(200, 90, 23, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}>
                <Truck size={22} color="var(--accent-spark)" />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                24-Hour Air Dispatch
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Centrally warehoused inventory shipped insured via Bluedart Air Cargo directly to tier-1 and tier-2 stores across India.
              </p>
            </div>

            <div style={{
              padding: "32px 24px",
              border: "1px solid var(--border-light)",
              borderRadius: "4px",
              backgroundColor: "var(--bg-surface)",
            }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "4px",
                backgroundColor: "rgba(200, 90, 23, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}>
                <ShieldCheck size={22} color="var(--accent-spark)" />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                Store Counter Displays
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Orders over 50 units qualify for complimentary brushed aluminum POS counter displays and acrylic brand stands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Margin & Profit Calculator Section */}
      <section id="calculator" style={{ padding: "80px 0", backgroundColor: "#f6f3eb", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--accent-spark)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              <Calculator size={15} />
              <span>Interactive ROI Simulator</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 600, color: "var(--text-main)", marginTop: "6px" }}>
              Wholesale Margin Calculator
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
              Simulate your shop&apos;s purchase investment and projected retail margins across volume discount breaks.
            </p>
          </div>

          <div style={{
            maxWidth: "960px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
          }} className="calculator-grid">
            {/* Left Controls */}
            <div style={{ padding: "40px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>
                1. Select Lighter Model
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "32px" }}>
                {wholesaleCatalog.map((prod, idx) => (
                  <button
                    key={prod.slug}
                    type="button"
                    onClick={() => {
                      setSelectedProductIdx(idx);
                      if (orderQty < prod.tiers[0].minQty) {
                        setOrderQty(prod.tiers[0].minQty);
                      }
                    }}
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      borderRadius: "3px",
                      border: selectedProductIdx === idx ? "2px solid var(--accent-spark)" : "1px solid var(--border-light)",
                      backgroundColor: selectedProductIdx === idx ? "rgba(200, 90, 23, 0.05)" : "#faf9f6",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-main)" }}>
                      {prod.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                      MSRP {formatCurrency(prod.retailPrice)}
                    </div>
                  </button>
                ))}
              </div>

              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>
                2. Choose Order Carton Size
              </h3>

              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                {[20, 50, 100, 250].map((qtyOption) => (
                  <button
                    key={qtyOption}
                    type="button"
                    onClick={() => setOrderQty(qtyOption)}
                    style={{
                      flex: 1,
                      padding: "12px 8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      borderRadius: "3px",
                      backgroundColor: orderQty === qtyOption ? "#141414" : "#f0ebe1",
                      color: orderQty === qtyOption ? "#ffffff" : "var(--text-main)",
                      border: "1px solid var(--border-light)",
                      cursor: "pointer",
                    }}
                  >
                    {qtyOption} pcs
                  </button>
                ))}
              </div>

              {/* Slider for custom quantity */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                  <span>Custom Quantity</span>
                  <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{orderQty} units</span>
                </div>
                <input
                  type="range"
                  min={currentProduct.tiers[0].minQty}
                  max="300"
                  step="5"
                  value={orderQty}
                  onChange={(e) => setOrderQty(parseInt(e.target.value) || 20)}
                  style={{ width: "100%", accentColor: "var(--accent-spark)", cursor: "pointer" }}
                />
              </div>

              <div style={{ marginTop: "24px", padding: "12px 16px", backgroundColor: "#f9f8f4", borderRadius: "3px", fontSize: "12px" }}>
                <span style={{ color: "var(--accent-spark)", fontWeight: 700 }}>Active Tier:</span> {activeTierLabel}
              </div>
            </div>

            {/* Right Results Panel */}
            <div style={{
              backgroundColor: "#141414",
              color: "#eae5dc",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "var(--accent-spark)",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}>
                  Projected Financials
                </div>
                <h4 style={{ fontSize: "22px", fontFamily: "var(--font-serif)", color: "#ffffff", marginBottom: "28px" }}>
                  {orderQty}x {currentProduct.name}
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderBottom: "1px solid #282828", paddingBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "#8a857d" }}>Wholesale Cost / Unit:</span>
                    <span style={{ color: "var(--accent-spark)", fontWeight: 700 }}>{formatCurrency(unitCost)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "#8a857d" }}>Consumer Retail MSRP:</span>
                    <span style={{ color: "#fff" }}>{formatCurrency(currentProduct.retailPrice)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "#8a857d" }}>Total Wholesale Purchase:</span>
                    <span style={{ color: "#fff", fontWeight: 700 }}>{formatCurrency(totalWholesaleInvestment)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "#8a857d" }}>Projected Retail Turnover:</span>
                    <span style={{ color: "#fff" }}>{formatCurrency(totalRetailRevenue)}</span>
                  </div>
                </div>

                {/* Big Profit Box */}
                <div style={{ marginTop: "24px" }}>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#8a857d", letterSpacing: "0.08em" }}>
                    Estimated Retail Gross Margin
                  </div>
                  <div style={{
                    fontSize: "38px",
                    fontWeight: 800,
                    color: "var(--accent-green)",
                    lineHeight: 1.1,
                    marginTop: "6px",
                  }}>
                    {formatCurrency(grossProfit)}
                  </div>
                  <div style={{
                    display: "inline-block",
                    backgroundColor: "rgba(40, 167, 69, 0.15)",
                    color: "var(--accent-green)",
                    padding: "4px 10px",
                    borderRadius: "3px",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginTop: "8px",
                  }}>
                    ★ {grossMarginPercent}% GROSS PROFIT MARGIN
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: "32px" }}>
                <button
                  type="button"
                  onClick={handleAddCartonToCart}
                  className="btn-spark"
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: "13px",
                    fontWeight: 700,
                    borderRadius: "3px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <TrendingUp size={16} />
                  <span>ADD WHOLESALE CARTON TO BAG ({orderQty} PCS)</span>
                </button>
                <div style={{ fontSize: "11px", color: "#777", textAlign: "center", marginTop: "10px" }}>
                  Instant checkout via Razorpay with GST Invoicing enabled
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" style={{ padding: "80px 0", backgroundColor: "#ffffff", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container" style={{ maxWidth: "780px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent-spark)", textTransform: "uppercase" }}>
              Official Onboarding
            </span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 600, color: "var(--text-main)", marginTop: "6px" }}>
              Apply for Wholesale Partnership
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
              Fill in your retail or corporate credentials below. Our merchant trade desk reviews and approves applications within 4 hours.
            </p>
          </div>

          {submitSuccess ? (
            <div style={{
              backgroundColor: "rgba(40, 167, 69, 0.08)",
              border: "1px solid rgba(40, 167, 69, 0.3)",
              borderRadius: "4px",
              padding: "40px",
              textAlign: "center",
            }}>
              <CheckCircle2 size={48} color="var(--accent-green)" style={{ margin: "0 auto 16px auto" }} />
              <h3 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
                Wholesale Application Received
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "480px", margin: "0 auto 24px auto", lineHeight: 1.6 }}>
                Thank you, <strong>{form.contact_name}</strong>. Our enterprise sales manager will reach out to <strong>{form.email}</strong> with your commercial dealer tier credentials and sample kit shipment details.
              </p>
              <Link href="/collection" className="btn-primary" style={{ padding: "12px 24px" }}>
                Browse Catalog in Wholesale Mode
              </Link>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: "4px",
              padding: "36px",
            }}>
              {submitError && (
                <div style={{
                  padding: "12px 16px",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "3px",
                  color: "#dc2626",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "24px",
                }}>
                  <AlertCircle size={16} />
                  <span>{submitError}</span>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }} className="form-two-col">
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                    Business / Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Cigar Lounge & Co."
                    value={form.business_name}
                    onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "13px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      backgroundColor: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                    Primary Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={form.contact_name}
                    onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "13px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      backgroundColor: "#fff",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }} className="form-two-col">
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                    Business Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="purchasing@store.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "13px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      backgroundColor: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                    Direct Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "13px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      backgroundColor: "#fff",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }} className="form-two-col">
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                    City & State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "13px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      backgroundColor: "#fff",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                    GSTIN Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="27ABCDE1234F1Z5"
                    value={form.gstin}
                    onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "13px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      backgroundColor: "#fff",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                  Estimated Monthly Order Volume
                </label>
                <select
                  value={form.estimated_volume}
                  onChange={(e) => setForm({ ...form, estimated_volume: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    fontSize: "13px",
                    border: "1px solid var(--border-light)",
                    borderRadius: "2px",
                    backgroundColor: "#fff",
                    outline: "none",
                  }}
                >
                  <option value="20-50">Trial Tier: 20 to 50 lighters / month</option>
                  <option value="50-100">Store Standard: 50 to 100 lighters / month</option>
                  <option value="100-300">High Volume Retailer: 100 to 300 lighters / month</option>
                  <option value="300+">Regional Master Distributor: 300+ units / month</option>
                </select>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                  Store Profile / Special Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your boutique location, customer demographic, or if you require custom laser logo engraving for events..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    fontSize: "13px",
                    border: "1px solid var(--border-light)",
                    borderRadius: "2px",
                    backgroundColor: "#fff",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-spark"
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "13px",
                  fontWeight: 700,
                  borderRadius: "2px",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? "TRANSMITTING APPLICATION..." : "SUBMIT WHOLESALE APPLICATION →"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ padding: "70px 0", backgroundColor: "#faf9f6" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent-spark)", textTransform: "uppercase" }}>
              Help & Clarifications
            </span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 600, color: "var(--text-main)", marginTop: "6px" }}>
              Wholesale Partner FAQ
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "3px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>
                What is the minimum order quantity (MOQ) for wholesale pricing?
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Our standard MOQ starts at 15 to 25 pieces per model depending on the finish. You can also mix-and-match models across a total carton of 50 pieces to qualify for Master Carton volume tiers.
              </p>
            </div>

            <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "3px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>
                How does Razorpay B2B payment and GST billing work?
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                You can pay seamlessly at checkout via Corporate Credit Cards, Net Banking (SBI, HDFC, ICICI, Axis), RTGS, or UPI. A computerized GST tax invoice with 18% HSN credit is emailed upon order placement.
              </p>
            </div>

            <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "3px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>
                Do you provide custom corporate logo laser engraving?
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Yes! For corporate gifting or bespoke hotel merchandise orders over 50 units, our fiber-laser team can engrave custom typography, serial numbers, or emblems on the lighter spine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals and Drawers */}
      <CartDrawer />
      <WholesaleInquiryModal
        isOpen={isWholesaleModalOpen}
        onClose={() => setIsWholesaleModalOpen(false)}
      />

      <Footer />

      <style jsx>{`
        @media (max-width: 900px) {
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .calculator-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .benefits-grid {
            grid-template-columns: 1fr !important;
          }
          .form-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
