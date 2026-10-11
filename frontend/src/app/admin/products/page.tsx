"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import {
  Package,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  X,
  ExternalLink,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [restockProductModal, setRestockProductModal] = useState<Product | null>(null);
  const [restockDelta, setRestockDelta] = useState<number>(50);
  const [restockReason, setRestockReason] = useState<string>("Boutique warehouse replenishment");
  const [isRestocking, setIsRestocking] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadCatalog = () => {
    setIsLoading(true);
    api
      .getProducts()
      .then(setProducts)
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProductModal) return;

    setIsRestocking(true);
    try {
      await api.restockProduct(restockProductModal.id, restockDelta, restockReason);
      setFeedbackMsg(`Successfully added ${restockDelta} units to ${restockProductModal.name}!`);
      setTimeout(() => setFeedbackMsg(""), 3500);
      setRestockProductModal(null);
      setRestockDelta(50);
      loadCatalog();
    } catch (err: any) {
      alert(err.message || "Restock failed");
    } finally {
      setIsRestocking(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.finish.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  });

  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock_quantity, 0);
  const totalRetailValuation = products.reduce((sum, p) => sum + p.stock_quantity * p.retail_price, 0);
  const totalWholesaleValuation = products.reduce((sum, p) => sum + p.stock_quantity * p.wholesale_price, 0);

  return (
    <main className="container" style={{ padding: "36px 20px 80px 20px" }}>
      {/* Title & Actions */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "28px",
      }}>
        <div>
          <div style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "var(--accent-spark)",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}>
            WAREHOUSE & CATALOG
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 3.5vw, 36px)",
            fontWeight: 600,
            color: "var(--text-main)",
          }}>
            Inventory & SKU Management
          </h1>
        </div>

        <button
          onClick={loadCatalog}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            fontWeight: 700,
            backgroundColor: "#ffffff",
            color: "var(--text-main)",
            border: "1px solid var(--border-light)",
            padding: "8px 16px",
            borderRadius: "2px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh Catalog</span>
        </button>
      </div>

      {feedbackMsg && (
        <div style={{
          padding: "10px 16px",
          backgroundColor: "rgba(45, 138, 84, 0.12)",
          color: "var(--accent-green)",
          borderRadius: "3px",
          fontSize: "13px",
          fontWeight: 600,
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Valuation & Units Stat Strips */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "28px",
      }}>
        <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Total Warehouse Units
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: "var(--text-main)" }}>
            {totalInventoryUnits} pieces
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Active Lighter Models
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: "var(--text-main)" }}>
            {products.length} SKUs
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Retail Inventory Value
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: "var(--accent-green)" }}>
            {formatCurrency(totalRetailValuation)}
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Wholesale Value (B2B)
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: "var(--accent-spark)" }}>
            {formatCurrency(totalWholesaleValuation)}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border-light)",
        borderRadius: "4px",
        padding: "16px 20px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: "380px",
        }}>
          <Search size={15} style={{ position: "absolute", left: "12px", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search lighter model, finish, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 34px",
              fontSize: "12px",
              border: "1px solid var(--border-light)",
              borderRadius: "2px",
              outline: "none",
              backgroundColor: "#faf9f6",
            }}
          />
        </div>

        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Showing <strong>{filteredProducts.length}</strong> of {products.length} models
        </div>
      </div>

      {/* Products Table */}
      <div style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border-light)",
        borderRadius: "4px",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}>
        {isLoading && products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
            Loading catalog inventory...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f5f2ea", borderBottom: "1px solid var(--border-light)" }}>
                  <th style={{ padding: "12px 16px" }}>Lighter SKU</th>
                  <th style={{ padding: "12px 16px" }}>Finish & Details</th>
                  <th style={{ padding: "12px 16px" }}>Retail MSRP</th>
                  <th style={{ padding: "12px 16px" }}>Wholesale Base</th>
                  <th style={{ padding: "12px 16px" }}>Stock Level</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                  <th style={{ padding: "12px 16px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const isLow = p.stock_quantity < 35 && p.stock_quantity > 0;
                  const isOut = p.stock_quantity === 0;

                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid #f0eae1" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: "44px",
                            height: "50px",
                            position: "relative",
                            backgroundColor: "var(--bg-podium)",
                            borderRadius: "2px",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}>
                            <Image
                              src={p.image_url}
                              alt={p.name}
                              fill
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{p.name}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                              /{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <div>{p.finish}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          Weight: {p.weight_grams}g • Rating: {p.rating} ★
                        </div>
                      </td>

                      <td style={{ padding: "14px 16px", fontWeight: 700 }}>
                        {formatCurrency(p.retail_price)}
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ color: "var(--accent-spark)", fontWeight: 700 }}>
                          {formatCurrency(p.wholesale_price)}
                        </div>
                        <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                          MOQ: {p.min_wholesale_qty} units
                        </div>
                      </td>

                      <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: "14px" }}>
                        {p.stock_quantity} units
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        {isOut ? (
                          <span style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#9b1c1c",
                            backgroundColor: "#fde8e8",
                            padding: "3px 8px",
                            borderRadius: "2px",
                          }}>
                            OUT OF STOCK
                          </span>
                        ) : isLow ? (
                          <span style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#c85a17",
                            backgroundColor: "rgba(200, 90, 23, 0.12)",
                            padding: "3px 8px",
                            borderRadius: "2px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}>
                            <AlertTriangle size={12} />
                            LOW STOCK
                          </span>
                        ) : (
                          <span style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--accent-green)",
                            backgroundColor: "rgba(45, 138, 84, 0.1)",
                            padding: "3px 8px",
                            borderRadius: "2px",
                          }}>
                            HEALTHY
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => {
                              setRestockProductModal(p);
                              setRestockDelta(50);
                            }}
                            style={{
                              padding: "6px 12px",
                              fontSize: "11px",
                              fontWeight: 700,
                              background: "#141414",
                              color: "#ffffff",
                              borderRadius: "2px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <PlusCircle size={13} />
                            <span>Restock</span>
                          </button>

                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            title="View Public Store Page"
                            style={{ color: "var(--text-muted)", padding: "4px" }}
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      {restockProductModal && (
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
          onClick={() => setRestockProductModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              width: "100%",
              maxWidth: "460px",
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "var(--shadow-dark)",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border-light)",
              backgroundColor: "#f7f5f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--accent-spark)", fontWeight: 700, letterSpacing: "0.1em" }}>
                  INVENTORY REPLENISHMENT
                </div>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>
                  Restock {restockProductModal.name}
                </div>
              </div>

              <button
                onClick={() => setRestockProductModal(null)}
                style={{
                  background: "#ebe5db",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRestockSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{
                backgroundColor: "#faf9f6",
                padding: "12px 14px",
                borderRadius: "3px",
                border: "1px solid var(--border-light)",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
              }}>
                <span style={{ color: "var(--text-muted)" }}>Current Stock Balance:</span>
                <span style={{ fontWeight: 800 }}>{restockProductModal.stock_quantity} units</span>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "6px" }}>
                  Quantity to Add
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={restockDelta}
                  onChange={(e) => setRestockDelta(Number(e.target.value) || 0)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-light)",
                    borderRadius: "2px",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                />

                <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                  {[25, 50, 100, 250].map((quickQty) => (
                    <button
                      key={quickQty}
                      type="button"
                      onClick={() => setRestockDelta(quickQty)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: restockDelta === quickQty ? "#141414" : "#f0ece3",
                        color: restockDelta === quickQty ? "#fff" : "var(--text-main)",
                        borderRadius: "2px",
                      }}
                    >
                      +{quickQty}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "6px" }}>
                  Audit Reason / Source
                </label>
                <input
                  type="text"
                  required
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                  placeholder="e.g. Received new shipment from CNC casting workshop"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-light)",
                    borderRadius: "2px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{
                backgroundColor: "rgba(45, 138, 84, 0.08)",
                padding: "12px 14px",
                borderRadius: "3px",
                fontSize: "12px",
                color: "var(--accent-green)",
                fontWeight: 600,
              }}>
                Projected New Balance: {restockProductModal.stock_quantity + (restockDelta || 0)} pieces
              </div>

              <button
                type="submit"
                disabled={isRestocking}
                className="btn-primary"
                style={{ padding: "14px", width: "100%", marginTop: "4px" }}
              >
                {isRestocking ? "UPDATING POSTGRES INVENTORY..." : "CONFIRM RESTOCK UNITS"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
