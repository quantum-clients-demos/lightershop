"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flame } from "lucide-react";

export function HeroSection() {
  const [isSparkActive, setIsSparkActive] = useState(false);

  return (
    <section style={{
      position: "relative",
      overflow: "hidden",
      borderBottom: "1px solid var(--border-light)",
      backgroundColor: "var(--bg-primary)",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr",
        minHeight: "580px",
      }} className="hero-grid">
        {/* Left Column */}
        <div style={{
          padding: "80px 48px 80px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRight: "1px solid var(--border-light)",
        }} className="hero-left">
          <div style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--accent-spark)",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{
              width: "8px",
              height: "2px",
              backgroundColor: "var(--accent-spark)",
              display: "inline-block",
            }} />
            EVERYDAY OBJECTS. CONSIDERED DESIGN.
          </div>

          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(42px, 5.2vw, 68px)",
            fontWeight: 600,
            lineHeight: 1.05,
            color: "var(--text-main)",
            letterSpacing: "-0.02em",
            marginBottom: "28px",
          }}>
            A little spark.<br />
            A lasting impression.
          </h1>

          <p style={{
            fontSize: "16px",
            lineHeight: 1.6,
            color: "var(--text-muted)",
            maxWidth: "460px",
            marginBottom: "40px",
          }}>
            Explore a curated range of pocket lighters, gift-worthy pieces and everyday essentials. Find the finish and style that feels like you.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link
              href="#collection"
              className="btn-primary"
              style={{
                padding: "16px 32px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              EXPLORE THE COLLECTION <ArrowUpRight size={16} />
            </Link>

            <Link
              href="#approach"
              className="btn-secondary"
              style={{
                padding: "15px 30px",
              }}
            >
              ABOUT OUR SHOP
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div
          onMouseEnter={() => setIsSparkActive(true)}
          onMouseLeave={() => setIsSparkActive(false)}
          style={{
            position: "relative",
            backgroundColor: "#221d18",
            backgroundImage: "radial-gradient(circle at 60% 45%, #4a382c 0%, #1c1714 65%, #100d0b 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "40px",
          }}
          className="hero-right"
        >
          {/* Concentric orbital background rings */}
          <div style={{
            position: "absolute",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            border: "1px solid rgba(220, 160, 100, 0.15)",
            pointerEvents: "none",
          }} className="animate-spin-slow" />

          <div style={{
            position: "absolute",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            border: "1px dashed rgba(220, 160, 100, 0.12)",
            pointerEvents: "none",
          }} />

          {/* Interactive spark warm glow */}
          <div style={{
            position: "absolute",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: isSparkActive
              ? "radial-gradient(circle, rgba(235, 120, 40, 0.45) 0%, rgba(200, 90, 23, 0) 70%)"
              : "radial-gradient(circle, rgba(200, 100, 30, 0.25) 0%, rgba(200, 90, 23, 0) 70%)",
            transition: "all 0.6s ease",
            filter: "blur(20px)",
            pointerEvents: "none",
          }} />

          {/* Floating Lighter Image */}
          <div
            className="animate-float"
            style={{
              position: "relative",
              width: "320px",
              height: "360px",
              zIndex: 2,
              filter: "drop-shadow(0 25px 35px rgba(0, 0, 0, 0.6))",
              transition: "transform 0.5s ease",
              transform: isSparkActive ? "scale(1.04) rotate(-1deg)" : "scale(1)",
            }}
          >
            <Image
              src="/images/hero-lighter.png"
              alt="Ember Titanium Lighter with Orbital Flame Ring"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 360px"
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Interactive spark trigger button */}
          <button
            onClick={() => setIsSparkActive(!isSparkActive)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: isSparkActive ? "rgba(200, 90, 23, 0.25)" : "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: isSparkActive ? "#ffaa6b" : "#bbb",
              fontSize: "11px",
              padding: "6px 12px",
              borderRadius: "20px",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
          >
            <Flame size={14} color={isSparkActive ? "#ff8833" : "#aaa"} />
            <span>{isSparkActive ? "SPARK IGNITED" : "TEST SPARK"}</span>
          </button>

          {/* Caption at bottom right */}
          <div style={{
            position: "absolute",
            bottom: "28px",
            right: "32px",
            fontSize: "11px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(240, 230, 215, 0.6)",
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
          }}>
            DESIGNED FOR YOUR EVERYDAY CARRY
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-left {
            padding: 48px 24px !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border-light);
          }
          .hero-right {
            min-height: 420px;
          }
        }
      `}</style>
    </section>
  );
}
