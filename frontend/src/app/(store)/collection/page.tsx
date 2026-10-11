"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { ProductQuickViewModal } from "@/components/ProductQuickViewModal";
import { WholesaleInquiryModal } from "@/components/WholesaleInquiryModal";
import { Product } from "@/types";
import { api } from "@/lib/api";
import { useCart } from "@/features/cart/cartStore";
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  Flame,
  ArrowUpDown,
  Building2,
  Sparkles,
  Layers,
} from "lucide-react";

// Fallback products catalog for instant load
const defaultCatalog: Product[] = [
  {
    id: 1,
    name: "Classic Steel",
    slug: "classic-steel",
    tagline: "Everyday objects. Considered design.",
    description: "Crafted from aerospace-grade brushed stainless steel with precision flint wheel ignition. A balanced, tactile weight designed for longevity. Features a wind-resistant wick cowl and refillable butane chamber.",
    finish: "Brushed finish · Everyday carry",
    color_hex: "#b0b3b8",
    badge: "BESTSELLER",
    image_url: "/images/classic-steel.png",
    retail_price: 699,
    wholesale_price: 420,
    min_wholesale_qty: 20,
    stock_quantity: 420,
    weight_grams: 85,
    is_active: true,
    rating: 4.9,
    reviews_count: 142,
    category_id: 1,
    wholesale_tiers: [
      { id: 1, min_qty: 20, unit_price: 420, tier_label: "Starter Pack (20+)" },
      { id: 2, min_qty: 50, unit_price: 380, tier_label: "Master Carton (50+)" },
      { id: 3, min_qty: 100, unit_price: 340, tier_label: "Distributor Pallet (100+)" },
    ],
  },
  {
    id: 2,
    name: "Midnight Black",
    slug: "midnight-black",
    tagline: "Stealth aesthetics. Modern tactile grip.",
    description: "A deep matte black PVD coating offers unmatched fingerprint resistance and a velvety tactile handfeel. Designed for discreet carry with a whisper-smooth spark mechanism.",
    finish: "Matte finish · Minimal profile",
    color_hex: "#1b1b1b",
    badge: "POPULAR",
    image_url: "/images/midnight-black.png",
    retail_price: 899,
    wholesale_price: 540,
    min_wholesale_qty: 20,
    stock_quantity: 380,
    weight_grams: 82,
    is_active: true,
    rating: 4.9,
    reviews_count: 118,
    category_id: 2,
    wholesale_tiers: [
      { id: 4, min_qty: 20, unit_price: 540, tier_label: "Starter Pack (20+)" },
      { id: 5, min_qty: 50, unit_price: 490, tier_label: "Master Carton (50+)" },
      { id: 6, min_qty: 100, unit_price: 440, tier_label: "Distributor Pallet (100+)" },
    ],
  },
  {
    id: 3,
    name: "Heritage Gold",
    slug: "heritage-gold",
    tagline: "Warm metallic finish. Collectible style.",
    description: "A refined tribute to mid-century heirloom craftsmanship. Brushed champagne gold finish with custom-engineered wind-resistant wick and jewel-cut flint housing.",
    finish: "Warm metallic finish · Gift pick",
    color_hex: "#c5a059",
    badge: "GIFT PICK",
    image_url: "/images/heritage-gold.png",
    retail_price: 1299,
    wholesale_price: 780,
    min_wholesale_qty: 15,
    stock_quantity: 240,
    weight_grams: 95,
    is_active: true,
    rating: 5.0,
    reviews_count: 89,
    category_id: 3,
    wholesale_tiers: [
      { id: 7, min_qty: 15, unit_price: 780, tier_label: "Boutique Display (15+)" },
      { id: 8, min_qty: 50, unit_price: 710, tier_label: "Wholesale Carton (50+)" },
      { id: 9, min_qty: 100, unit_price: 650, tier_label: "Partner Distributor (100+)" },
    ],
  },
  {
    id: 4,
    name: "Crimson Edition",
    slug: "crimson-edition",
    tagline: "Bold colour. Compact architectural design.",
    description: "Anodized deep ruby crimson body with contrasting brushed rim. Brings an unmistakable character and vibrant accent to your pocket accessories.",
    finish: "Bold colour · Compact design",
    color_hex: "#9e2a2b",
    badge: "NEW",
    image_url: "/images/crimson-edition.png",
    retail_price: 999,
    wholesale_price: 600,
    min_wholesale_qty: 20,
    stock_quantity: 310,
    weight_grams: 80,
    is_active: true,
    rating: 4.8,
    reviews_count: 64,
    category_id: 2,
    wholesale_tiers: [
      { id: 10, min_qty: 20, unit_price: 600, tier_label: "Starter Pack (20+)" },
      { id: 11, min_qty: 50, unit_price: 540, tier_label: "Master Carton (50+)" },
      { id: 12, min_qty: 100, unit_price: 490, tier_label: "Distributor Pallet (100+)" },
    ],
  },
  {
    id: 5,
    name: "Pocket Essential",
    slug: "pocket-essential",
    tagline: "Ultra-lightweight. Clean lines.",
    description: "Featherweight aerospace alloy built for everyday wear and tear. Slim cylinder profile slides seamlessly into any coin pocket or organizer pouch.",
    finish: "Clean lines · Lightweight style",
    color_hex: "#8a8d91",
    badge: "EVERYDAY",
    image_url: "/images/pocket-essential.png",
    retail_price: 549,
    wholesale_price: 330,
    min_wholesale_qty: 25,
    stock_quantity: 560,
    weight_grams: 68,
    is_active: true,
    rating: 4.7,
    reviews_count: 98,
    category_id: 1,
    wholesale_tiers: [
      { id: 13, min_qty: 25, unit_price: 330, tier_label: "Retail Tray (25+)" },
      { id: 14, min_qty: 50, unit_price: 290, tier_label: "Carton Bulk (50+)" },
      { id: 15, min_qty: 100, unit_price: 260, tier_label: "Wholesale Case (100+)" },
    ],
  },
  {
    id: 6,
    name: "Signature Black",
    slug: "signature-black",
    tagline: "Dark finish. Statement piece.",
    description: "Our flagship dual-action flame igniter. Diamond-knurled striker with double fuel capacity for discerning collectors and cigar lounges.",
    finish: "Dark finish · Statement piece",
    color_hex: "#0d0d0d",
    badge: "PREMIUM",
    image_url: "/images/midnight-black.png",
    retail_price: 1499,
    wholesale_price: 900,
    min_wholesale_qty: 10,
    stock_quantity: 190,
    weight_grams: 102,
    is_active: true,
    rating: 5.0,
    reviews_count: 73,
    category_id: 2,
    wholesale_tiers: [
      { id: 16, min_qty: 10, unit_price: 900, tier_label: "Club Pack (10+)" },
      { id: 17, min_qty: 30, unit_price: 820, tier_label: "Executive Carton (30+)" },
      { id: 18, min_qty: 75, unit_price: 750, tier_label: "Master Dealer (75+)" },
    ],
  },
];

type CategoryFilter = "all" | "steel" | "black" | "gold" | "crimson" | "pocket";

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>(defaultCatalog);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);

  const { storeMode, setStoreMode } = useCart();
  const isWholesale = storeMode === "wholesale";

  useEffect(() => {
    api
      .getProducts()
      .then((data) => {
        if (data && data.length > 0) setProducts(data);
      })
      .catch(() => {});
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.finish.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    // Category / Finish filter
    if (categoryFilter !== "all") {
      if (categoryFilter === "steel") {
        list = list.filter((p) => p.slug.includes("steel"));
      } else if (categoryFilter === "black") {
        list = list.filter((p) => p.slug.includes("black"));
      } else if (categoryFilter === "gold") {
        list = list.filter((p) => p.slug.includes("gold"));
      } else if (categoryFilter === "crimson") {
        list = list.filter((p) => p.slug.includes("crimson"));
      } else if (categoryFilter === "pocket") {
        list = list.filter((p) => p.slug.includes("pocket"));
      }
    }

    // Sorting
    list.sort((a, b) => {
      const priceA = isWholesale ? a.wholesale_price : a.retail_price;
      const priceB = isWholesale ? b.wholesale_price : b.retail_price;

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return a.id - b.id; // featured default
    });

    return list;
  }, [products, searchQuery, categoryFilter, sortBy, isWholesale]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      <AnnouncementBar />
      <Navbar onOpenWholesaleModal={() => setIsWholesaleModalOpen(true)} />

      {/* Breadcrumb Bar */}
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
          <span style={{ color: "var(--accent-spark)", fontWeight: 600 }}>Full Catalog</span>
        </div>
      </div>

      {/* Header Banner */}
      <section style={{
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-light)",
        padding: "48px 0 40px 0",
      }}>
        <div className="container">
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}>
            <div style={{ maxWidth: "600px" }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent-spark)",
                marginBottom: "8px",
              }}>
                <Flame size={14} />
                <span>The Complete Engineering Collection</span>
              </div>
              <h1 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(32px, 4vw, 44px)",
                fontWeight: 600,
                color: "var(--text-main)",
                marginBottom: "12px",
                lineHeight: 1.15,
              }}>
                Precision pocket igniters.
              </h1>
              <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Machined from aerospace aluminium and solid brass. Designed for timeless everyday carry with refillable butane mechanics and tactile flint ignitions.
              </p>
            </div>

            {/* Mode Indicator & Switch */}
            <div style={{
              background: isWholesale ? "rgba(200, 90, 23, 0.08)" : "#f0ebe1",
              border: isWholesale ? "1px solid rgba(200, 90, 23, 0.3)" : "1px solid var(--border-light)",
              borderRadius: "4px",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              minWidth: "260px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Active Mode:
                </span>
                <span style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: isWholesale ? "var(--accent-spark)" : "var(--text-main)",
                }}>
                  {isWholesale ? "B2B WHOLESALE (40% OFF)" : "INDIVIDUAL RETAIL"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setStoreMode("retail")}
                  style={{
                    flex: 1,
                    padding: "8px",
                    fontSize: "11px",
                    fontWeight: 700,
                    borderRadius: "2px",
                    backgroundColor: !isWholesale ? "#141414" : "transparent",
                    color: !isWholesale ? "#ffffff" : "var(--text-muted)",
                    border: "1px solid var(--border-light)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  Retail
                </button>
                <button
                  type="button"
                  onClick={() => setStoreMode("wholesale")}
                  style={{
                    flex: 1,
                    padding: "8px",
                    fontSize: "11px",
                    fontWeight: 700,
                    borderRadius: "2px",
                    backgroundColor: isWholesale ? "var(--accent-spark)" : "transparent",
                    color: isWholesale ? "#ffffff" : "var(--text-muted)",
                    border: "1px solid var(--border-light)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  Wholesale
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar Controls */}
      <section style={{
        borderBottom: "1px solid var(--border-light)",
        backgroundColor: "#ffffff",
        padding: "18px 0",
      }}>
        <div className="container">
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            {/* Category Filter Pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                style={{
                  padding: "7px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: categoryFilter === "all" ? 700 : 500,
                  backgroundColor: categoryFilter === "all" ? "#141414" : "#f5f2ec",
                  color: categoryFilter === "all" ? "#ffffff" : "var(--text-main)",
                  border: "1px solid var(--border-light)",
                  transition: "all var(--transition-fast)",
                }}
              >
                All Finishes ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("steel")}
                style={{
                  padding: "7px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: categoryFilter === "steel" ? 700 : 500,
                  backgroundColor: categoryFilter === "steel" ? "#141414" : "#f5f2ec",
                  color: categoryFilter === "steel" ? "#ffffff" : "var(--text-main)",
                  border: "1px solid var(--border-light)",
                  transition: "all var(--transition-fast)",
                }}
              >
                Brushed Steel
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("black")}
                style={{
                  padding: "7px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: categoryFilter === "black" ? 700 : 500,
                  backgroundColor: categoryFilter === "black" ? "#141414" : "#f5f2ec",
                  color: categoryFilter === "black" ? "#ffffff" : "var(--text-main)",
                  border: "1px solid var(--border-light)",
                  transition: "all var(--transition-fast)",
                }}
              >
                Matte Obsidian
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("gold")}
                style={{
                  padding: "7px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: categoryFilter === "gold" ? 700 : 500,
                  backgroundColor: categoryFilter === "gold" ? "#141414" : "#f5f2ec",
                  color: categoryFilter === "gold" ? "#ffffff" : "var(--text-main)",
                  border: "1px solid var(--border-light)",
                  transition: "all var(--transition-fast)",
                }}
              >
                Heritage Gold
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("crimson")}
                style={{
                  padding: "7px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: categoryFilter === "crimson" ? 700 : 500,
                  backgroundColor: categoryFilter === "crimson" ? "#141414" : "#f5f2ec",
                  color: categoryFilter === "crimson" ? "#ffffff" : "var(--text-main)",
                  border: "1px solid var(--border-light)",
                  transition: "all var(--transition-fast)",
                }}
              >
                Ruby Crimson
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("pocket")}
                style={{
                  padding: "7px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: categoryFilter === "pocket" ? 700 : 500,
                  backgroundColor: categoryFilter === "pocket" ? "#141414" : "#f5f2ec",
                  color: categoryFilter === "pocket" ? "#ffffff" : "var(--text-main)",
                  border: "1px solid var(--border-light)",
                  transition: "all var(--transition-fast)",
                }}
              >
                Pocket Slim
              </button>
            </div>

            {/* Right: Search & Sort Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              {/* Search Bar */}
              <div style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}>
                <Search size={15} style={{ position: "absolute", left: "12px", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search lighter model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "8px 12px 8px 34px",
                    fontSize: "12px",
                    border: "1px solid var(--border-light)",
                    borderRadius: "2px",
                    width: "200px",
                    outline: "none",
                    backgroundColor: "#faf9f6",
                  }}
                />
              </div>

              {/* Sort Selector */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                border: "1px solid var(--border-light)",
                borderRadius: "2px",
                padding: "4px 10px",
                backgroundColor: "#faf9f6",
              }}>
                <ArrowUpDown size={14} color="var(--text-muted)" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-main)",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid Main Area */}
      <main className="container" style={{ padding: "50px 24px 80px 24px" }}>
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 20px",
            backgroundColor: "#ffffff",
            border: "1px solid var(--border-light)",
            borderRadius: "4px",
          }}>
            <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "16px" }}>
              No lighters match &ldquo;{searchQuery}&rdquo; in the selected filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}>
              <span>Showing <strong>{filteredProducts.length}</strong> precision lighters</span>
              {isWholesale && (
                <span style={{ color: "var(--accent-spark)", fontWeight: 700 }}>
                  ★ Volume Tier pricing automatically applies at checkout
                </span>
              )}
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }} className="collection-grid">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Wholesale Callout Banner */}
        <div style={{
          marginTop: "70px",
          backgroundColor: "#111111",
          borderRadius: "4px",
          padding: "48px 40px",
          color: "#eae5dc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--accent-spark)",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}>
              <Building2 size={15} />
              <span>Commercial Distribution & Wholesale</span>
            </div>
            <h3 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "26px",
              color: "#ffffff",
              marginBottom: "8px",
            }}>
              Stock Ember & Co. in your boutique or retail chain.
            </h3>
            <p style={{ fontSize: "14px", color: "#8a857d", maxWidth: "600px" }}>
              Enjoy 40%+ dealer margins, GST input invoices, and dedicated relationship management. Custom laser branding available for corporate gifting.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/wholesale" className="btn-spark" style={{ padding: "14px 24px", fontSize: "12px" }}>
              Explore Wholesale Program →
            </Link>
            <Link
              href="/contact"
              style={{
                border: "1px solid #444",
                color: "#eae5dc",
                padding: "14px 22px",
                fontSize: "12px",
                fontWeight: 700,
                borderRadius: "2px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </main>

      {/* Modals and Drawers */}
      <CartDrawer />
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <WholesaleInquiryModal
        isOpen={isWholesaleModalOpen}
        onClose={() => setIsWholesaleModalOpen(false)}
      />

      <Footer />

      <style jsx>{`
        @media (max-width: 960px) {
          .collection-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .collection-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
