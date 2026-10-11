"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/features/cart/cartStore";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { Eye, Check, Layers } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { storeMode, addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isWholesale = storeMode === "wholesale";
  const displayPrice = isWholesale ? product.wholesale_price : product.retail_price;
  const retailOriginal = product.retail_price;
  const wholesaleDiscountPct = Math.round(((retailOriginal - product.wholesale_price) / retailOriginal) * 100);

  const handleAdd = () => {
    const qty = isWholesale ? product.min_wholesale_qty : 1;
    addItem(product, qty, storeMode);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        borderRadius: "2px",
        overflow: "hidden",
        position: "relative",
        transition: "transform var(--transition-normal), box-shadow var(--transition-normal)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? "var(--shadow-md)" : "var(--shadow-sm)",
      }}
    >
      {/* Product Image Stage (Podium) */}
      <div style={{
        position: "relative",
        height: "330px",
        backgroundColor: "var(--bg-podium)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflow: "hidden",
      }}>
        {/* Badge */}
        {product.badge && (
          <div style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#1c1c1c",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "4px 8px",
            borderRadius: "2px",
            backdropFilter: "blur(6px)",
            zIndex: 5,
          }}>
            {product.badge}
          </div>
        )}

        {/* Wholesale savings tag */}
        {isWholesale && (
          <div style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#ffffff",
            backgroundColor: "var(--accent-spark)",
            padding: "4px 8px",
            borderRadius: "2px",
            zIndex: 5,
          }}>
            SAVE {wholesaleDiscountPct}%
          </div>
        )}

        {/* Lighter Packshot */}
        <Link
          href={`/product/${product.slug}`}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "block",
            transition: "transform 0.4s var(--ease-smooth)",
            transform: isHovered ? "scale(1.06)" : "scale(1)",
          }}
        >
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            style={{ objectFit: "contain" }}
          />
        </Link>

        {/* Quick View Button on Hover */}
        <button
          onClick={() => onQuickView(product)}
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid var(--border-light)",
            borderRadius: "2px",
            padding: "7px 12px",
            fontSize: "11px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "var(--text-main)",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(8px)",
            transition: "all var(--transition-fast)",
            backdropFilter: "blur(4px)",
            zIndex: 10,
          }}
        >
          <Eye size={13} />
          <span>VIEW TIERS</span>
        </button>
      </div>

      {/* Card Details Footer */}
      <div style={{
        padding: "20px 22px 24px 22px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
      }}>
        <div>
          <Link
            href={`/product/${product.slug}`}
            style={{
              display: "block",
              fontSize: "17px",
              fontWeight: 700,
              color: "var(--text-main)",
              marginBottom: "4px",
              letterSpacing: "-0.01em",
              textDecoration: "none",
            }}
          >
            {product.name}
          </Link>

          <div style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            marginBottom: "16px",
          }}>
            {product.finish}
          </div>
        </div>

        {/* Price & Action Row */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "12px",
          borderTop: "1px solid #f2ede5",
          paddingTop: "16px",
        }}>
          <div>
            {isWholesale ? (
              <div>
                <div style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "var(--accent-spark)",
                  lineHeight: 1.1,
                }}>
                  {formatCurrency(displayPrice)}
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-muted)", marginLeft: "4px" }}>
                    / unit
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  MOQ {product.min_wholesale_qty} pcs · Pack {formatCurrency(displayPrice * product.min_wholesale_qty)}
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  fontSize: "19px",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  lineHeight: 1.1,
                }}>
                  {formatCurrency(displayPrice)}
                </div>
                <div style={{ fontSize: "11px", color: "#8a857d", marginTop: "2px" }}>
                  Incl. 18% GST
                </div>
              </div>
            )}
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={handleAdd}
            style={{
              backgroundColor: isAdded ? "var(--accent-green)" : "#141414",
              color: "#ffffff",
              padding: "10px 18px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all var(--transition-fast)",
              whiteSpace: "nowrap",
            }}
          >
            {isAdded ? (
              <>
                <Check size={14} /> ADDED
              </>
            ) : isWholesale ? (
              <>
                <Layers size={14} /> ADD PACK ({product.min_wholesale_qty})
              </>
            ) : (
              "ADD TO BAG +"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
