"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/features/cart/cartStore";
import { formatCurrency } from "@/lib/formatters";
import { X, Trash2, ArrowRight, Truck, Tag, Layers, Check } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    quote,
    isQuoteLoading,
    storeMode,
    couponCode,
    applyCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon.trim());
      setCouponApplied(true);
    }
  };

  const freeShippingThreshold = 1999;
  const currentSubtotal = quote?.subtotal || 0;
  const progressPct = Math.min(100, Math.round((currentSubtotal / freeShippingThreshold) * 100));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 16, 14, 0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={closeCart}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "480px",
          height: "100%",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-dark)",
          animation: "slideInRight 0.35s var(--ease-smooth)",
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: "24px 28px",
          borderBottom: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f9f8f5",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "16px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: "var(--text-main)",
            }}>
              YOUR BAG ({items.reduce((s, i) => s + i.quantity, 0)})
            </div>
            <div style={{
              fontSize: "11px",
              color: storeMode === "wholesale" ? "var(--accent-spark)" : "var(--text-muted)",
              fontWeight: 600,
              marginTop: "2px",
            }}>
              {storeMode === "wholesale" ? "WHOLESALE B2B ORDER ACTIVE" : "RETAIL ORDER"}
            </div>
          </div>

          <button
            onClick={closeCart}
            style={{
              background: "#ede8de",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-main)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div style={{
          padding: "14px 28px",
          backgroundColor: "#f4f1ea",
          borderBottom: "1px solid var(--border-light)",
          fontSize: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <Truck size={15} color="var(--accent-spark)" />
            {currentSubtotal >= freeShippingThreshold ? (
              <span style={{ fontWeight: 600, color: "var(--accent-green)" }}>
                You have unlocked FREE Complimentary Shipping!
              </span>
            ) : (
              <span>
                Add <strong>{formatCurrency(freeShippingThreshold - currentSubtotal)}</strong> more for FREE shipping
              </span>
            )}
          </div>
          <div style={{
            height: "5px",
            width: "100%",
            backgroundColor: "#dfd8cd",
            borderRadius: "3px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${progressPct}%`,
              backgroundColor: currentSubtotal >= freeShippingThreshold ? "var(--accent-green)" : "var(--accent-spark)",
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>
          {items.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-muted)",
            }}>
              <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Your bag is currently empty</div>
              <p style={{ fontSize: "13px", marginBottom: "20px" }}>Discover our minimalist pocket lighters and add your favourite finishes.</p>
              <button
                onClick={closeCart}
                className="btn-primary"
                style={{ padding: "10px 20px" }}
              >
                BROWSE COLLECTION
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemQuote = quote?.items.find((qi) => qi.product_id === item.productId);
              const unitPrice = itemQuote ? itemQuote.unit_price : (item.mode === "wholesale" ? item.product.wholesale_price : item.product.retail_price);
              const lineTotal = itemQuote ? itemQuote.total_price : unitPrice * item.quantity;

              return (
                <div
                  key={item.productId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr",
                    gap: "16px",
                    paddingBottom: "18px",
                    borderBottom: "1px solid #f0eae1",
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    position: "relative",
                    width: "72px",
                    height: "84px",
                    backgroundColor: "var(--bg-podium)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}>
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                          {item.product.name}
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          style={{ color: "#a09a90", padding: "2px" }}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {item.product.finish}
                      </div>

                      {item.mode === "wholesale" && (
                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "var(--accent-spark)",
                          background: "rgba(200, 90, 23, 0.08)",
                          padding: "2px 6px",
                          borderRadius: "2px",
                          marginTop: "4px",
                        }}>
                          <Layers size={11} /> WHOLESALE PACK (MOQ {item.product.min_wholesale_qty})
                        </div>
                      )}
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}>
                      {/* Quantity Stepper */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid var(--border-light)",
                        borderRadius: "2px",
                        fontSize: "12px",
                      }}>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - (item.mode === "wholesale" ? 5 : 1))}
                          style={{ padding: "4px 8px", fontWeight: 700 }}
                        >
                          -
                        </button>
                        <span style={{ padding: "4px 10px", fontWeight: 700 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + (item.mode === "wholesale" ? 5 : 1))}
                          style={{ padding: "4px 8px", fontWeight: 700 }}
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)" }}>
                          {formatCurrency(lineTotal)}
                        </div>
                        {item.mode === "wholesale" && (
                          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                            {formatCurrency(unitPrice)}/unit
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Quote Breakdown */}
        {items.length > 0 && (
          <div style={{
            padding: "24px 28px",
            borderTop: "1px solid var(--border-light)",
            backgroundColor: "#faf9f6",
          }}>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="Coupon (e.g. SPARK10)"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  fontSize: "12px",
                  border: "1px solid var(--border-light)",
                  borderRadius: "2px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#141414",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  padding: "8px 14px",
                  borderRadius: "2px",
                }}
              >
                APPLY
              </button>
            </form>

            {/* Financial summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", marginBottom: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>Subtotal</span>
                <span>{formatCurrency(quote?.subtotal || 0)}</span>
              </div>

              {quote && quote.wholesale_savings > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-green)", fontWeight: 600 }}>
                  <span>Wholesale Volume Savings</span>
                  <span>-{formatCurrency(quote.wholesale_savings)}</span>
                </div>
              )}

              {quote && quote.discount_amount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-spark)", fontWeight: 600 }}>
                  <span>Promo Discount ({couponCode})</span>
                  <span>-{formatCurrency(quote.discount_amount)}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>GST (18% Indian Tax)</span>
                <span>{formatCurrency(quote?.tax_amount || 0)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>Shipping</span>
                <span>{quote?.shipping_amount === 0 ? "FREE" : formatCurrency(quote?.shipping_amount || 0)}</span>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "18px",
                fontWeight: 800,
                color: "var(--text-main)",
                borderTop: "1px solid #e8e2d8",
                paddingTop: "10px",
                marginTop: "4px",
              }}>
                <span>Total</span>
                <span>{formatCurrency(quote?.total_amount || 0)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Link */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
