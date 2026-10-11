import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, CreditCard } from "lucide-react";

export function Footer() {
  return (
    <footer style={{
      backgroundColor: "#0d0d0d",
      color: "#eae5dc",
      padding: "80px 0 40px 0",
      borderTop: "1px solid #222222",
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr",
          gap: "48px",
          marginBottom: "60px",
        }} className="footer-grid">
          {/* Col 1 */}
          <div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "0.16em",
              color: "#ffffff",
              marginBottom: "16px",
            }}>
              EMBER&CO.
            </div>
            <p style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#8a857d",
              maxWidth: "320px",
              marginBottom: "20px",
            }}>
              Curated everyday pocket lighters. Precision mechanical engineering meets timeless tactile finishes for retail connoisseurs and wholesale partners.
            </p>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "#a49d91",
            }}>
              <Lock size={14} color="var(--accent-spark)" />
              <span>256-Bit SSL Encrypted Razorpay Checkout</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <div style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#ffffff",
              marginBottom: "18px",
            }}>
              The Collection
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#8a857d" }}>
              <li><Link href="/product/classic-steel" style={{ transition: "color 0.2s" }}>Classic Steel</Link></li>
              <li><Link href="/product/midnight-black" style={{ transition: "color 0.2s" }}>Midnight Black</Link></li>
              <li><Link href="/product/heritage-gold" style={{ transition: "color 0.2s" }}>Heritage Gold</Link></li>
              <li><Link href="/product/crimson-edition" style={{ transition: "color 0.2s" }}>Crimson Edition</Link></li>
              <li><Link href="/product/pocket-essential" style={{ transition: "color 0.2s" }}>Pocket Essential</Link></li>
              <li><Link href="/collection" style={{ transition: "color 0.2s", color: "var(--accent-spark)", fontWeight: 600 }}>View All Catalog →</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <div style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#ffffff",
              marginBottom: "18px",
            }}>
              Wholesale & Support
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#8a857d" }}>
              <li><Link href="/wholesale">B2B Wholesale Portal</Link></li>
              <li><Link href="/wholesale#calculator">Volume Margins Calculator</Link></li>
              <li><Link href="/approach">Engineering & Materials</Link></li>
              <li><Link href="/contact">Boutiques & Inquiries</Link></li>
              <li><Link href="/checkout/track">Track Live Order</Link></li>
              <li><Link href="/admin">Merchant Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <div style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#ffffff",
              marginBottom: "18px",
            }}>
              Payment Partners
            </div>
            <p style={{ fontSize: "13px", color: "#8a857d", lineHeight: 1.6, marginBottom: "16px" }}>
              Official integration with <strong>Razorpay Standard Checkout</strong>. Supports UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards, Net Banking, and Corporate Wallets.
            </p>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#181818",
              padding: "10px 14px",
              borderRadius: "4px",
              border: "1px solid #282828",
            }}>
              <CreditCard size={18} color="var(--accent-spark)" />
              <div style={{ fontSize: "12px", color: "#eee", fontWeight: 600 }}>
                Powered by Razorpay Payments
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid #1c1c1c",
          paddingTop: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "#6b665e",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div>
            © {new Date().getFullYear()} Ember & Co. All rights reserved. Demo e-commerce system.
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping & GST Disclosures</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 580px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
