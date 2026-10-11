"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WholesaleInquiryModal } from "@/components/WholesaleInquiryModal";
import {
  Flame,
  ShieldCheck,
  Compass,
  Layers,
  Scale,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Award,
  Zap,
  Check,
  X,
} from "lucide-react";

export default function ApproachPage() {
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);

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
          <span style={{ color: "var(--accent-spark)", fontWeight: 600 }}>Our Approach & Craftsmanship</span>
        </div>
      </div>

      {/* Editorial Hero */}
      <section style={{
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-light)",
        padding: "80px 0 90px 0",
      }}>
        <div className="container" style={{ maxWidth: "860px", textAlign: "center" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: "var(--accent-spark)",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}>
            <Compass size={16} />
            <span>Industrial Design & Material Integrity</span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(38px, 5.5vw, 56px)",
            fontWeight: 600,
            color: "var(--text-main)",
            lineHeight: 1.15,
            marginBottom: "24px",
          }}>
            Everyday objects built for decades, not discards.
          </h1>

          <p style={{
            fontSize: "18px",
            lineHeight: 1.75,
            color: "var(--text-muted)",
            maxWidth: "720px",
            margin: "0 auto 36px auto",
          }}>
            Over 1.5 billion plastic lighters are tossed into oceans and landfills each year. Ember &amp; Co. was founded on an unapologetic counter-philosophy: revive precision mechanical engineering, acoustic feedback, and heirloom metalcraft.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/collection" className="btn-spark" style={{ padding: "14px 28px", fontSize: "13px" }}>
              Explore The Collection →
            </Link>
            <Link href="/wholesale" className="btn-secondary" style={{ padding: "14px 28px", fontSize: "13px" }}>
              Wholesale Trade Program
            </Link>
          </div>
        </div>
      </section>

      {/* Chapter 1: The Anatomy of an Ember Lighter */}
      <section style={{ padding: "90px 0", borderBottom: "1px solid var(--border-light)", backgroundColor: "#ffffff" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }} className="approach-grid">
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent-spark)", textTransform: "uppercase" }}>
                Chapter 01 · Metallurgy & Tolerances
              </span>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 600, color: "var(--text-main)", margin: "10px 0 20px 0", lineHeight: 1.2 }}>
                Monolithic Billet CNC Milling.
              </h2>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--text-muted)", marginBottom: "20px" }}>
                Each lighter shell is carved from a solid ingot of aerospace-grade 6061-T6 aluminum or C36000 lead-free cartridge brass. Rather than cheap stamped tin, our 5-axis CNC machining maintains tolerances down to <strong>±0.02 mm</strong>.
              </p>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--text-muted)", marginBottom: "28px" }}>
                The result is a satisfying, dense handfeel that balances intuitively between your thumb and forefinger with zero seams, zero rattles, and impervious drop resistance.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ borderLeft: "2px solid var(--accent-spark)", paddingLeft: "14px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>±0.02 mm</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Micro-machined tolerance</div>
                </div>
                <div style={{ borderLeft: "2px solid var(--accent-spark)", paddingLeft: "14px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-main)" }}>85 Grams</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Calibrated counterweight</div>
                </div>
              </div>
            </div>

            {/* Visual Pod */}
            <div style={{
              backgroundColor: "var(--bg-podium)",
              borderRadius: "4px",
              padding: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              border: "1px solid var(--border-light)",
            }}>
              <div style={{ position: "relative", width: "280px", height: "360px" }}>
                <Image
                  src="/images/classic-steel.png"
                  alt="Classic Steel Monolith"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: Acoustically Tuned Hinge */}
      <section style={{ padding: "90px 0", borderBottom: "1px solid var(--border-light)", backgroundColor: "#f9f8f4" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }} className="approach-grid">
            {/* Visual Pod */}
            <div style={{
              backgroundColor: "#181818",
              borderRadius: "4px",
              padding: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #282828",
            }}>
              <div style={{ position: "relative", width: "280px", height: "360px" }}>
                <Image
                  src="/images/midnight-black.png"
                  alt="Midnight Black Hinge"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>

            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent-spark)", textTransform: "uppercase" }}>
                Chapter 02 · Acoustic Mechanics
              </span>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 600, color: "var(--text-main)", margin: "10px 0 20px 0", lineHeight: 1.2 }}>
                The Resonant Snap.
              </h2>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--text-muted)", marginBottom: "20px" }}>
                A truly exceptional tactile object engages the ear as much as the hand. We spent seven months prototyping our dual-torsion stainless steel cam spring.
              </p>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--text-muted)", marginBottom: "28px" }}>
                When flicked open, the lid snaps back with a pure, high-frequency harmonic ping. No looseness, no wobble. The closing action is equally crisp and positive, sealing the internal chamber instantly.
              </p>

              <div style={{ display: "flex", gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Sparkles size={20} color="var(--accent-spark)" />
                  <span style={{ fontSize: "13px", fontWeight: 700 }}>Dual Cam Springs</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <ShieldCheck size={20} color="var(--accent-spark)" />
                  <span style={{ fontSize: "13px", fontWeight: 700 }}>100,000+ Cycles Tested</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: Comparison Matrix: Plastic vs Ember & Co. */}
      <section style={{ padding: "90px 0", borderBottom: "1px solid var(--border-light)", backgroundColor: "#ffffff" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent-spark)", textTransform: "uppercase" }}>
              Permanent vs Disposable
            </span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 600, color: "var(--text-main)", marginTop: "6px" }}>
              How Ember &amp; Co. compares to throwaways.
            </h2>
          </div>

          <div style={{
            border: "1px solid var(--border-light)",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr",
              backgroundColor: "#181818",
              color: "#ffffff",
              padding: "16px 24px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              <span>Specification</span>
              <span style={{ color: "#a49d91" }}>Disposable Plastic Lighter</span>
              <span style={{ color: "var(--accent-spark)" }}>Ember &amp; Co. Mechanical</span>
            </div>

            {[
              {
                spec: "Expected Lifespan",
                disp: "2 to 3 weeks (Single use)",
                ember: "Decades (Heirloom quality)",
              },
              {
                spec: "Body Casing Material",
                disp: "Brittle molded polystyrene",
                ember: "6061 Aerospace Aluminum / Brass",
              },
              {
                spec: "Refill Capability",
                disp: "Non-refillable (Discarded)",
                ember: "Standard Butane Port & Wick Refill",
              },
              {
                spec: "Wind Resistance",
                disp: "Blows out easily in wind",
                ember: "Shielded Chimney Cowl Aerodynamics",
              },
              {
                spec: "Flint Replacement",
                disp: "Impossible (Throwaway)",
                ember: "Universal Spring-Loaded Flint Holder",
              },
              {
                spec: "Tactile Experience & Grip",
                disp: "Cheap plastic, squeaks",
                ember: "85g weighted, tuned cam acoustics",
              },
              {
                spec: "Environmental Impact",
                disp: "1.5B units pollute oceans annually",
                ember: "Zero landfill footprint, forever gear",
              },
            ].map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1fr",
                  padding: "16px 24px",
                  borderBottom: idx < 6 ? "1px solid var(--border-light)" : "none",
                  backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fbf9f5",
                  fontSize: "13px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{row.spec}</span>
                <span style={{ color: "#8a857d", display: "flex", alignItems: "center", gap: "6px" }}>
                  <X size={15} color="#dc2626" /> {row.disp}
                </span>
                <span style={{ color: "var(--text-main)", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                  <Check size={16} color="var(--accent-green)" /> {row.ember}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 4: Lifetime Warranty & Repair Pledge */}
      <section style={{ padding: "80px 0", backgroundColor: "#111111", color: "#eae5dc" }}>
        <div className="container" style={{ maxWidth: "800px", textAlign: "center" }}>
          <Award size={44} color="var(--accent-spark)" style={{ margin: "0 auto 16px auto" }} />
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", color: "#ffffff", marginBottom: "16px" }}>
            The Ember &amp; Co. Lifetime Mechanical Guarantee
          </h2>
          <p style={{ fontSize: "16px", color: "#8a857d", lineHeight: 1.7, marginBottom: "32px" }}>
            If your lighter ever suffers from a mechanical hinge failure, spring fatigue, or fuel valve blockage at any time during its ownership, return it to our Mumbai repair bench. We will service the movement, replace o-rings, re-polish the shell, and return it to you free of service fees.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/collection" className="btn-spark" style={{ padding: "14px 28px", fontSize: "13px" }}>
              Shop Heirloom Lighters
            </Link>
            <Link href="/contact" style={{
              border: "1px solid #444",
              color: "#eae5dc",
              padding: "14px 24px",
              borderRadius: "2px",
              fontSize: "13px",
              fontWeight: 700,
            }}>
              Visit Our Flagship Boutiques
            </Link>
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
        @media (max-width: 860px) {
          .approach-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
