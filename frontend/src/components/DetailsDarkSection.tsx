import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Zap, Truck, CreditCard } from "lucide-react";

export function DetailsDarkSection() {
  return (
    <section id="approach" style={{
      backgroundColor: "var(--bg-dark)",
      color: "var(--text-inverse)",
      padding: "100px 0 110px 0",
      borderTop: "1px solid var(--border-dark)",
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "64px",
          alignItems: "center",
        }} className="dark-grid">
          {/* Left Column */}
          <div>
            <div style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent-spark)",
              marginBottom: "16px",
            }}>
              MORE THAN A PRODUCT
            </div>

            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 4.2vw, 56px)",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "28px",
            }}>
              Good design is in the details.
            </h2>

            <p style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#a6a095",
              marginBottom: "20px",
              maxWidth: "520px",
            }}>
              Present your full range in one place, help shoppers compare finishes, and give customers a straightforward way to complete retail purchases or order wholesale master cartons. A well-organised platform makes your brand easier to discover and your buying process intuitive.
            </p>

            <p style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#7e786e",
              marginBottom: "36px",
              maxWidth: "520px",
            }}>
              We provide full integration with Razorpay hosted checkout, automated GST invoice generation, and real-time inventory management with database audit trails.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link
                href="#collection"
                className="btn-spark"
                style={{
                  padding: "15px 30px",
                }}
              >
                DISCUSS YOUR STORE <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Highlight Box */}
          <div style={{
            border: "1px solid #2a2520",
            backgroundColor: "var(--bg-dark-card)",
            padding: "44px 38px",
            borderRadius: "4px",
            position: "relative",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.4)",
          }}>
            <div style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-spark)",
              marginBottom: "12px",
            }}>
              THE ONLINE STORE EXPERIENCE
            </div>

            <h3 style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.3,
              marginBottom: "18px",
              letterSpacing: "-0.01em",
            }}>
              Clear products.<br />
              Confident choices.<br />
              A smoother checkout.
            </h3>

            <p style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#9d978d",
              marginBottom: "32px",
            }}>
              Product details, stock availability, delivery information and customer support — together in one considered experience.
            </p>

            {/* Feature pills inside dark box */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              paddingTop: "24px",
              borderTop: "1px solid #282828",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#ccc" }}>
                <CreditCard size={16} color="var(--accent-spark)" />
                <span>Razorpay Standard Checkout</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#ccc" }}>
                <Truck size={16} color="var(--accent-spark)" />
                <span>Tiered Bulk Freight</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#ccc" }}>
                <ShieldCheck size={16} color="var(--accent-spark)" />
                <span>B2B GST Tax Invoicing</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#ccc" }}>
                <Zap size={16} color="var(--accent-spark)" />
                <span>Atomic Stock Lock</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          .dark-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
