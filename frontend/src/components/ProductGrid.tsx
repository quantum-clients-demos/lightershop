"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { useCart } from "@/features/cart/cartStore";
import { Sparkles, Building2 } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onOpenWholesaleModal: () => void;
}

export function ProductGrid({ products, onQuickView, onOpenWholesaleModal }: ProductGridProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { storeMode, setStoreMode } = useCart();

  const filterOptions = [
    { id: "all", label: "All products" },
    { id: "classic", label: "Classic" },
    { id: "premium-finish", label: "Premium finish" },
    { id: "gift-picks", label: "Gift picks" },
    { id: "wholesale-mode", label: "Wholesale packs" },
  ];

  const handleFilterClick = (filterId: string) => {
    if (filterId === "wholesale-mode") {
      setStoreMode("wholesale");
      setSelectedFilter("all");
    } else {
      setSelectedFilter(filterId);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "classic") return p.category_id === 1 || p.slug.includes("classic");
    if (selectedFilter === "premium-finish") return p.category_id === 2 || p.finish.includes("Matte") || p.finish.includes("Dark");
    if (selectedFilter === "gift-picks") return p.category_id === 3 || p.badge === "GIFT PICK" || p.finish.includes("Gold");
    return true;
  });

  return (
    <section id="collection" style={{
      padding: "80px 0 100px 0",
      backgroundColor: "var(--bg-primary)",
      borderBottom: "1px solid var(--border-light)",
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "36px",
          flexWrap: "wrap",
          gap: "24px",
        }}>
          <div>
            <div style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent-spark)",
              marginBottom: "12px",
            }}>
              THE COLLECTION
            </div>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 600,
              color: "var(--text-main)",
              letterSpacing: "-0.02em",
            }}>
              Find your everyday lighter.
            </h2>
          </div>

          <div style={{
            maxWidth: "400px",
            fontSize: "13px",
            lineHeight: 1.6,
            color: "var(--text-muted)",
          }}>
            Browse the range by finish and style. Product names, prices and images shown here are live demo content ready for retail and wholesale transactions.
          </div>
        </div>

        {/* Filter Pills & Wholesale Mode Toggle */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {filterOptions.map((f) => {
              const isActive = selectedFilter === f.id || (f.id === "wholesale-mode" && storeMode === "wholesale");
              return (
                <button
                  key={f.id}
                  onClick={() => handleFilterClick(f.id)}
                  style={{
                    padding: "9px 18px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    borderRadius: "2px",
                    backgroundColor: isActive ? "#141414" : "#ffffff",
                    color: isActive ? "#ffffff" : "var(--text-main)",
                    border: "1px solid var(--border-light)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Wholesale Status Indicator / Action */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {storeMode === "wholesale" ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(200, 90, 23, 0.12)",
                padding: "8px 14px",
                borderRadius: "2px",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--accent-spark)",
              }}>
                <Building2 size={15} />
                <span>Wholesale Pricing Active (Save 35-45% per unit)</span>
              </div>
            ) : (
              <button
                onClick={onOpenWholesaleModal}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                  fontWeight: 600,
                }}
              >
                <Sparkles size={14} color="var(--accent-spark)" />
                <span>Applying for wholesale business buyer account?</span>
              </button>
            )}
          </div>
        </div>

        {/* Wholesale Mode Notice Alert */}
        {storeMode === "wholesale" && (
          <div style={{
            background: "#1a1612",
            border: "1px solid #3d2f24",
            padding: "16px 20px",
            borderRadius: "4px",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            color: "#f2ece4",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                background: "var(--accent-spark)",
                color: "#ffffff",
                padding: "6px 10px",
                borderRadius: "3px",
                fontSize: "11px",
                fontWeight: 800,
              }}>
                B2B CATALOG
              </div>
              <div style={{ fontSize: "13px" }}>
                Carton packs are priced at tier rate with Minimum Order Quantity (MOQ). Valid GST credit available at checkout.
              </div>
            </div>
            <button
              onClick={() => setStoreMode("retail")}
              style={{
                fontSize: "12px",
                color: "#ffaa6b",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Switch back to Retail Mode →
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: "24px",
        }}>
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
