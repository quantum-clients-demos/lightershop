"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/features/cart/cartStore";
import { useAuth } from "@/features/auth/authStore";
import { X, CheckCircle, Building, ShieldCheck, Sparkles } from "lucide-react";

interface WholesaleInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WholesaleInquiryModal({ isOpen, onClose }: WholesaleInquiryModalProps) {
  const { setStoreMode } = useCart();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    business_name: "Luxe Retail & Hospitality LLP",
    gstin: "27AABCU9603R1ZM",
    contact_name: "Rohit Verma",
    contact_email: "rohit@luxeretail.in",
    contact_phone: "+91 9876543210",
    business_type: "Retailer Chain",
    estimated_monthly_volume: "100-300 units",
    notes: "Requesting distributor pricing for flagship boutiques in Mumbai and Delhi.",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await api.submitWholesaleApplication(formData);
      setIsSuccess(true);
      setStoreMode("wholesale");
      await refreshUser();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 16, 14, 0.7)",
        backdropFilter: "blur(6px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#ffffff",
          width: "100%",
          maxWidth: "580px",
          borderRadius: "4px",
          overflow: "hidden",
          boxShadow: "var(--shadow-dark)",
          position: "relative",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "24px 30px",
          borderBottom: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f7f5f0",
        }}>
          <div>
            <div style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--accent-spark)",
              textTransform: "uppercase",
            }}>
              B2B PARTNER NETWORK
            </div>
            <div style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text-main)",
              marginTop: "2px",
            }}>
              Wholesale Client Registration
            </div>
          </div>

          <button
            onClick={onClose}
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

        {/* Content */}
        <div style={{ padding: "30px", overflowY: "auto" }}>
          {isSuccess ? (
            <div style={{ textAlign: "center", padding: "30px 10px" }}>
              <CheckCircle size={54} color="var(--accent-green)" style={{ margin: "0 auto 16px auto" }} />
              <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
                Wholesale Access Unlocked!
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "24px" }}>
                Your business application for <strong>{formData.business_name}</strong> (GSTIN: {formData.gstin}) has been registered. Wholesale tier prices are now active in your session.
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
                style={{ padding: "14px 28px" }}
              >
                START BROWSING WHOLESALE CATALOG
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {errorMsg && (
                <div style={{
                  padding: "10px 14px",
                  background: "#fde8e8",
                  color: "#9b1c1c",
                  borderRadius: "3px",
                  fontSize: "13px",
                }}>
                  {errorMsg}
                </div>
              )}

              <div style={{
                background: "rgba(200, 90, 23, 0.08)",
                padding: "12px 16px",
                borderRadius: "3px",
                fontSize: "12px",
                color: "#7a3710",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <Sparkles size={18} />
                <span>Wholesale partners enjoy 35-45% margins, tier volume discounts, and 18% input GST tax credit invoices.</span>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Registered Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-light)",
                    borderRadius: "2px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    GSTIN Number (15 digits) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    placeholder="27AABCU9603R1ZM"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      fontSize: "13px",
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Business Category
                  </label>
                  <select
                    value={formData.business_type}
                    onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      fontSize: "13px",
                      background: "#fff",
                    }}
                  >
                    <option value="Retailer Chain">Retailer / Boutique</option>
                    <option value="Distributor">Wholesale Distributor</option>
                    <option value="Hospitality">Hotel / Cigar Lounge</option>
                    <option value="Corporate Gifting">Corporate Gifting Partner</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
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
                  <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                      fontSize: "13px",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Work Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
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
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Estimated Monthly Order Volume
                </label>
                <input
                  type="text"
                  value={formData.estimated_monthly_volume}
                  onChange={(e) => setFormData({ ...formData, estimated_monthly_volume: e.target.value })}
                  placeholder="e.g. 100-300 units"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-light)",
                    borderRadius: "2px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  padding: "15px",
                  width: "100%",
                  marginTop: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {isSubmitting ? "PROCESSING..." : "SUBMIT APPLICATION & UNLOCK WHOLESALE"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
