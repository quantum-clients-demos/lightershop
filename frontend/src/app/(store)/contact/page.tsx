"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WholesaleInquiryModal } from "@/components/WholesaleInquiryModal";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  Building2,
  Sparkles,
} from "lucide-react";

const showrooms = [
  {
    city: "Mumbai Flagship",
    neighborhood: "Kala Ghoda Heritage Arts District",
    address: "42 Ropewalk Lane, Behind Jehangir Art Gallery, Fort, Mumbai 400001",
    hours: "Mon – Sat: 11:00 AM – 8:00 PM · Sun: 12:00 PM – 7:00 PM",
    phone: "+91 (022) 2284-9102",
    concierge: "mumbai@emberlighters.in",
  },
  {
    city: "New Delhi Studio",
    neighborhood: "The Dhan Mill Compound",
    address: "Shed 12, 100 Feet Road, SSN Marg, Chhatarpur, New Delhi 110074",
    hours: "Tue – Sun: 11:30 AM – 8:30 PM (Mondays Closed)",
    phone: "+91 (011) 4120-7740",
    concierge: "delhi@emberlighters.in",
  },
  {
    city: "Bengaluru Experience",
    neighborhood: "Indiranagar 100ft Hub",
    address: "Plot 742, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
    hours: "Mon – Sun: 11:00 AM – 8:30 PM",
    phone: "+91 (080) 4952-1830",
    concierge: "bengaluru@emberlighters.in",
  },
];

export default function ContactPage() {
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry_type: "retail",
    order_ref: "",
    message: "",
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
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
          <span style={{ color: "var(--accent-spark)", fontWeight: 600 }}>Showrooms & Concierge Contact</span>
        </div>
      </div>

      {/* Header Banner */}
      <section style={{
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-light)",
        padding: "60px 0 60px 0",
      }}>
        <div className="container">
          <div style={{ maxWidth: "720px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent-spark)", textTransform: "uppercase" }}>
              Boutique Spaces & Trade Inquiries
            </span>
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 4.5vw, 48px)",
              fontWeight: 600,
              color: "var(--text-main)",
              marginTop: "8px",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}>
              Connect with Ember &amp; Co.
            </h1>
            <p style={{ fontSize: "16px", color: "var(--text-muted)", lineHeight: 1.7 }}>
              Experience the tactile weight of our solid metal pocket lighters in person at our flagship boutiques, or connect with our concierge team for custom engraving, corporate gifting, and wholesale accounts.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Showrooms + Contact Form */}
      <main className="container" style={{ padding: "70px 24px 90px 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "56px",
          alignItems: "flex-start",
        }} className="contact-grid">
          {/* Left Column: Flagship Showroom Locations */}
          <div>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "26px",
              fontWeight: 600,
              color: "var(--text-main)",
              marginBottom: "24px",
            }}>
              Flagship Boutique Showrooms
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {showrooms.map((room, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid var(--border-light)",
                    borderRadius: "4px",
                    padding: "28px",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-main)" }}>
                      {room.city}
                    </h3>
                    <span style={{ fontSize: "12px", color: "var(--accent-spark)", fontWeight: 700 }}>
                      {room.neighborhood}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", lineHeight: 1.6 }}>
                    <MapPin size={16} color="var(--accent-spark)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{room.address}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#6b665e", marginBottom: "8px" }}>
                    <Clock size={15} color="#8a857d" />
                    <span>{room.hours}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-light)", fontSize: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-main)", fontWeight: 600 }}>
                      <Phone size={14} color="var(--accent-spark)" /> {room.phone}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)" }}>
                      <Mail size={14} /> {room.concierge}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Support Info Box */}
            <div style={{
              marginTop: "32px",
              backgroundColor: "rgba(200, 90, 23, 0.06)",
              border: "1px solid rgba(200, 90, 23, 0.2)",
              borderRadius: "4px",
              padding: "24px",
            }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
                Need Immediate Assistance?
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "12px" }}>
                Our client concierge team is available on official WhatsApp Business from Monday to Saturday, 10:00 AM – 7:30 PM IST.
              </p>
              <div style={{ display: "flex", gap: "16px", fontSize: "13px", fontWeight: 700 }}>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ color: "var(--accent-spark)", textDecoration: "underline" }}>
                  Chat on WhatsApp →
                </a>
                <Link href="/checkout/track" style={{ color: "var(--text-main)", textDecoration: "underline" }}>
                  Track Active Order Status →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiries Form */}
          <div>
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid var(--border-light)",
              borderRadius: "4px",
              padding: "36px",
              boxShadow: "var(--shadow-sm)",
            }}>
              <h2 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "24px",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "6px",
              }}>
                Send a Message
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "28px" }}>
                Whether you have questions about fuel refills, wedding favor engraving, or bulk distribution, we will respond within 4 business hours.
              </p>

              {isSent ? (
                <div style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  backgroundColor: "rgba(40, 167, 69, 0.08)",
                  borderRadius: "4px",
                  border: "1px solid rgba(40, 167, 69, 0.3)",
                }}>
                  <CheckCircle2 size={44} color="var(--accent-green)" style={{ margin: "0 auto 12px auto" }} />
                  <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>Message Dispatched</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", maxWidth: "340px", margin: "0 auto" }}>
                    Thank you, {formData.name}. Our customer concierge has received your message and will reply to {formData.email} shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSent(false);
                      setFormData({ name: "", email: "", phone: "", inquiry_type: "retail", order_ref: "", message: "" });
                    }}
                    className="btn-primary"
                    style={{ marginTop: "20px", padding: "10px 20px", fontSize: "12px" }}
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siddharth Nair"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        fontSize: "13px",
                        border: "1px solid var(--border-light)",
                        borderRadius: "2px",
                        backgroundColor: "#faf9f6",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }} className="form-two-col">
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="siddharth@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          fontSize: "13px",
                          border: "1px solid var(--border-light)",
                          borderRadius: "2px",
                          backgroundColor: "#faf9f6",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98200 12345"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          fontSize: "13px",
                          border: "1px solid var(--border-light)",
                          borderRadius: "2px",
                          backgroundColor: "#faf9f6",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiry_type}
                      onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        fontSize: "13px",
                        border: "1px solid var(--border-light)",
                        borderRadius: "2px",
                        backgroundColor: "#faf9f6",
                        outline: "none",
                      }}
                    >
                      <option value="retail">Retail Product / Order Inquiry</option>
                      <option value="wholesale">Wholesale &amp; Retail Store Distribution</option>
                      <option value="corporate">Corporate Gifting &amp; Custom Engraving</option>
                      <option value="repair">Mechanical Repair &amp; Lifetime Warranty Service</option>
                      <option value="press">Press, Collaborations &amp; Media</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                      Order Reference ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ORD-20261011-9872"
                      value={formData.order_ref}
                      onChange={(e) => setFormData({ ...formData, order_ref: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        fontSize: "13px",
                        border: "1px solid var(--border-light)",
                        borderRadius: "2px",
                        backgroundColor: "#faf9f6",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "26px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                      Message or Query *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please let us know how we can assist you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        fontSize: "13px",
                        border: "1px solid var(--border-light)",
                        borderRadius: "2px",
                        backgroundColor: "#faf9f6",
                        outline: "none",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-spark"
                    style={{
                      width: "100%",
                      padding: "15px",
                      fontSize: "13px",
                      fontWeight: 700,
                      borderRadius: "2px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <Send size={15} />
                    <span>SUBMIT INQUIRY</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals and Drawers */}
      <CartDrawer />
      <WholesaleInquiryModal
        isOpen={isWholesaleModalOpen}
        onClose={() => setIsWholesaleModalOpen(false)}
      />

      <Footer />

      <style jsx>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .form-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
