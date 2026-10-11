"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/features/cart/cartStore";
import { formatCurrency } from "@/lib/formatters";
import { X, Check, ShieldCheck, Flame, Scale, Sparkles } from "lucide-react";

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const { storeMode, addItem } = useCart();
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isWholesale = storeMode === "wholesale";
  const defaultQty = isWholesale ? product.min_wholesale_qty : 1;
  const qty = Math.max(selectedQty, isWholesale ? product.min_wholesale_qty : 1);

  const handleAdd = () => {
    addItem(product, qty, storeMode);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 16, 14, 0.72)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#ffffff",
          width: "100%",
          maxWidth: "880px",
          borderRadius: "4px",
          overflow: "hidden",
          boxShadow: "var(--shadow-dark)",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          maxHeight: "90vh",
          position: "relative",
        }}
        className="modal-grid"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "#f0ece3",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-main)",
            zIndex: 10,
          }}
        >
          <X size={18} />
        </button>

        {/* Product Image Stage */}
        <div style={{
          backgroundColor: "var(--bg-podium)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          position: "relative",
        }}>
          <div style={{
            position: "relative",
            width: "100%",
            height: "360px",
          }}>
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          {product.badge && (
            <div style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "#141414",
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: 700,
              padding: "4px 8px",
              letterSpacing: "0.08em",
            }}>
              {product.badge}
            </div>
          )}
        </div>

        {/* Product Details & Wholesale Tiers */}
        <div style={{
          padding: "36px 32px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent-spark)",
              marginBottom: "8px",
            }}>
              {product.finish}
            </div>

            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "28px",
              fontWeight: 600,
              color: "var(--text-main)",
              marginBottom: "12px",
            }}>
              {product.name}
            </h2>

            <p style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "var(--text-muted)",
              marginBottom: "20px",
            }}>
              {product.description}
            </p>

            {/* Spec Highlights */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              padding: "16px",
              backgroundColor: "var(--bg-subtle)",
              borderRadius: "4px",
              marginBottom: "24px",
              fontSize: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Flame size={15} color="var(--accent-spark)" />
                <span>Classic flint wheel ignition</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Scale size={15} color="var(--accent-spark)" />
                <span>Weight: {product.weight_grams}g balanced</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={15} color="var(--accent-spark)" />
                <span>Lifetime warranty casing</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={15} color="var(--accent-spark)" />
                <span>Refillable standard butane</span>
              </div>
            </div>

            {/* Wholesale Tier Table */}
            {product.wholesale_tiers && product.wholesale_tiers.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-main)",
                  marginBottom: "8px",
                }}>
                  Wholesale Volume Pricing Tiers
                </div>
                <div style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: "3px",
                  overflow: "hidden",
                  fontSize: "12px",
                }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr 1fr",
                    background: "#ede8df",
                    padding: "8px 12px",
                    fontWeight: 700,
                    color: "var(--text-main)",
                  }}>
                    <div>Tier / Quantity</div>
                    <div>Price / unit</div>
                    <div>Savings</div>
                  </div>
                  {product.wholesale_tiers.map((t, idx) => (
                    <div key={idx} style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1fr 1fr",
                      padding: "8px 12px",
                      borderTop: "1px solid var(--border-light)",
                      background: qty >= t.min_qty ? "rgba(200, 90, 23, 0.08)" : "#fff",
                      fontWeight: qty >= t.min_qty ? 600 : 400,
                    }}>
                      <div>{t.tier_label || `${t.min_qty}+ units`}</div>
                      <div style={{ color: "var(--accent-spark)", fontWeight: 700 }}>
                        {formatCurrency(t.unit_price)}
                      </div>
                      <div style={{ color: "var(--accent-green)" }}>
                        Save {Math.round(((product.retail_price - t.unit_price) / product.retail_price) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Selected Pricing ({isWholesale ? "Wholesale" : "Retail"})
                </div>
                <div style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: isWholesale ? "var(--accent-spark)" : "var(--text-main)",
                }}>
                  {formatCurrency(isWholesale ? product.wholesale_price * qty : product.retail_price * qty)}
                </div>
              </div>

              {/* Quantity stepper */}
              <div style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid var(--border-light)",
                borderRadius: "3px",
                overflow: "hidden",
              }}>
                <button
                  onClick={() => setSelectedQty((prev) => Math.max(defaultQty, (prev || defaultQty) - (isWholesale ? 5 : 1)))}
                  style={{
                    padding: "8px 14px",
                    background: "#f7f5f0",
                    fontWeight: 700,
                  }}
                >
                  -
                </button>
                <span style={{ padding: "8px 16px", fontWeight: 700, minWidth: "40px", textAlign: "center" }}>
                  {qty}
                </span>
                <button
                  onClick={() => setSelectedQty((prev) => (prev || defaultQty) + (isWholesale ? 5 : 1))}
                  style={{
                    padding: "8px 14px",
                    background: "#f7f5f0",
                    fontWeight: 700,
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: isAdded ? "var(--accent-green)" : "#141414",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all var(--transition-normal)",
              }}
            >
              {isAdded ? (
                <>
                  <Check size={16} /> ADDED TO BAG
                </>
              ) : (
                `ADD TO BAG (${qty} UNITS)`
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 800px) {
          .modal-grid {
            grid-template-columns: 1fr !important;
            max-height: 85vh !important;
          }
        }
      `}</style>
    </div>
  );
}
