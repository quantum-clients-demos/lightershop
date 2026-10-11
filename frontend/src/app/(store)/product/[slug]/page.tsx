"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WholesaleInquiryModal } from "@/components/WholesaleInquiryModal";
import { ProductCard } from "@/components/ProductCard";
import { ProductQuickViewModal } from "@/components/ProductQuickViewModal";
import { Product } from "@/types";
import { api } from "@/lib/api";
import { useCart } from "@/features/cart/cartStore";
import { formatCurrency } from "@/lib/formatters";
import {
  Star,
  ShieldCheck,
  Truck,
  Flame,
  Scale,
  Sparkles,
  Layers,
  ArrowRight,
  Check,
  ChevronRight,
  RefreshCw,
  Building2,
  Lock,
} from "lucide-react";

// Catalog fallback for instant hydration
const catalogLookup: Record<string, Product> = {
  "classic-steel": {
    id: 1,
    name: "Classic Steel",
    slug: "classic-steel",
    tagline: "Everyday objects. Considered design.",
    description:
      "Crafted from aerospace-grade brushed stainless steel with precision flint wheel ignition. A balanced, tactile weight designed for longevity. Features a wind-resistant wick cowl and refillable standard butane chamber.",
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
  "midnight-black": {
    id: 2,
    name: "Midnight Black",
    slug: "midnight-black",
    tagline: "Stealth aesthetics. Modern tactile grip.",
    description:
      "A deep matte black PVD coating offers unmatched fingerprint resistance and a velvety tactile handfeel. Designed for discreet carry with a whisper-smooth spark mechanism.",
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
  "heritage-gold": {
    id: 3,
    name: "Heritage Gold",
    slug: "heritage-gold",
    tagline: "Warm metallic finish. Collectible style.",
    description:
      "A refined tribute to mid-century heirloom craftsmanship. Brushed champagne gold finish with custom-engineered wind-resistant wick and jewel-cut flint housing.",
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
  "crimson-edition": {
    id: 4,
    name: "Crimson Edition",
    slug: "crimson-edition",
    tagline: "Bold colour. Compact architectural design.",
    description:
      "Anodized deep ruby crimson body with contrasting brushed rim. Brings an unmistakable character and vibrant accent to your pocket accessories.",
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
  "pocket-essential": {
    id: 5,
    name: "Pocket Essential",
    slug: "pocket-essential",
    tagline: "Ultra-lightweight. Clean lines.",
    description:
      "Featherweight aerospace alloy built for everyday wear and tear. Slim cylinder profile slides seamlessly into any coin pocket or organizer pouch.",
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
  "signature-black": {
    id: 6,
    name: "Signature Black",
    slug: "signature-black",
    tagline: "Dark finish. Statement piece.",
    description:
      "Our flagship dual-action flame igniter. Diamond-knurled striker with double fuel capacity for discerning collectors and cigar lounges.",
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
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "classic-steel");

  const [product, setProduct] = useState<Product | null>(catalogLookup[slug] || null);
  const [allProducts, setAllProducts] = useState<Product[]>(Object.values(catalogLookup));
  const [selectedMode, setSelectedMode] = useState<"retail" | "wholesale">("retail");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "wholesale" | "shipping">("specs");
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { storeMode, addItem, openCart } = useCart();

  useEffect(() => {
    // Sync with global store mode initial state
    if (storeMode === "wholesale") {
      setSelectedMode("wholesale");
    }
  }, [storeMode]);

  useEffect(() => {
    // Attempt backend fetch
    api
      .getProduct(slug)
      .then((p) => {
        if (p) setProduct(p);
      })
      .catch(() => {
        if (catalogLookup[slug]) setProduct(catalogLookup[slug]);
      });

    api
      .getProducts()
      .then((prods) => {
        if (prods && prods.length > 0) setAllProducts(prods);
      })
      .catch(() => {});
  }, [slug]);

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
        <AnnouncementBar />
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2>Product Not Found</h2>
          <Link href="/collection" className="btn-primary" style={{ marginTop: "20px" }}>
            Return to Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isWholesale = selectedMode === "wholesale";
  const defaultMoq = product.min_wholesale_qty;
  const currentQty = isWholesale ? Math.max(quantity, defaultMoq) : quantity;

  // Tier calculation
  let effectiveUnitPrice = isWholesale ? product.wholesale_price : product.retail_price;
  let activeTierLabel = isWholesale ? `Starter MOQ (${defaultMoq}+)` : "Standard Retail";

  if (isWholesale && product.wholesale_tiers) {
    const sorted = [...product.wholesale_tiers].sort((a, b) => b.min_qty - a.min_qty);
    for (const t of sorted) {
      if (currentQty >= t.min_qty) {
        effectiveUnitPrice = t.unit_price;
        activeTierLabel = t.tier_label || `${t.min_qty}+ units`;
        break;
      }
    }
  }

  const lineTotal = effectiveUnitPrice * currentQty;
  const retailComparisonTotal = product.retail_price * currentQty;
  const wholesaleSavings = Math.max(0, retailComparisonTotal - lineTotal);

  const handleAddToCart = () => {
    addItem(product, currentQty, selectedMode);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addItem(product, currentQty, selectedMode);
    router.push("/checkout");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      <AnnouncementBar />
      <Navbar onOpenWholesaleModal={() => setIsWholesaleModalOpen(true)} />

      {/* Breadcrumbs */}
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
          <Link href="/collection" style={{ color: "var(--text-main)", fontWeight: 500 }}>Collection</Link>
          <ChevronRight size={13} />
          <span style={{ color: "var(--accent-spark)", fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      {/* Product Hero Section */}
      <main className="container" style={{ padding: "60px 24px 100px 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "56px",
          alignItems: "flex-start",
        }} className="pdp-grid">
          {/* Left Column: Image Showcase Stage */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div style={{
              backgroundColor: "var(--bg-podium)",
              borderRadius: "4px",
              padding: "48px 36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              minHeight: "520px",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
            }}>
              {product.badge && (
                <div style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#1c1c1c",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  padding: "6px 12px",
                  borderRadius: "2px",
                  backdropFilter: "blur(6px)",
                  zIndex: 5,
                }}>
                  {product.badge}
                </div>
              )}

              {isWholesale && (
                <div style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "var(--accent-spark)",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "6px 12px",
                  borderRadius: "2px",
                  zIndex: 5,
                }}>
                  SAVE UP TO 45% WHOLESALE
                </div>
              )}

              <div style={{
                position: "relative",
                width: "320px",
                height: "420px",
                filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.12))",
              }}>
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>

            {/* Micro feature badges under image */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              marginTop: "20px",
              textAlign: "center",
            }}>
              <div style={{
                background: "#ffffff",
                padding: "14px",
                borderRadius: "3px",
                border: "1px solid var(--border-light)",
                fontSize: "11px",
              }}>
                <Flame size={16} color="var(--accent-spark)" style={{ margin: "0 auto 6px auto" }} />
                <div style={{ fontWeight: 700 }}>Flint Igniter</div>
                <div style={{ color: "var(--text-muted)" }}>Precision wick spark</div>
              </div>

              <div style={{
                background: "#ffffff",
                padding: "14px",
                borderRadius: "3px",
                border: "1px solid var(--border-light)",
                fontSize: "11px",
              }}>
                <Scale size={16} color="var(--accent-spark)" style={{ margin: "0 auto 6px auto" }} />
                <div style={{ fontWeight: 700 }}>{product.weight_grams} Grams</div>
                <div style={{ color: "var(--text-muted)" }}>Balanced hand weight</div>
              </div>

              <div style={{
                background: "#ffffff",
                padding: "14px",
                borderRadius: "3px",
                border: "1px solid var(--border-light)",
                fontSize: "11px",
              }}>
                <ShieldCheck size={16} color="var(--accent-spark)" style={{ margin: "0 auto 6px auto" }} />
                <div style={{ fontWeight: 700 }}>Lifetime Shell</div>
                <div style={{ color: "var(--text-muted)" }}>Machined metal casing</div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Purchase Controls */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "var(--accent-spark)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}>
              <Sparkles size={14} />
              <span>{product.finish}</span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 4vw, 44px)",
              fontWeight: 600,
              color: "var(--text-main)",
              marginBottom: "10px",
            }}>
              {product.name}
            </h1>

            {/* Ratings */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <div style={{ display: "flex", color: "#f59e0b" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#f59e0b" />
                ))}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 700 }}>{product.rating}</span>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                ({product.reviews_count} verified reviews)
              </span>
            </div>

            <p style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "var(--text-muted)",
              marginBottom: "28px",
            }}>
              {product.description}
            </p>

            {/* Mode Toggle Switch Box */}
            <div style={{
              background: "#ffffff",
              border: "1px solid var(--border-light)",
              borderRadius: "4px",
              padding: "18px 20px",
              marginBottom: "28px",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}>
                <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Select Purchase Mode
                </span>
                <span style={{
                  fontSize: "11px",
                  color: isWholesale ? "var(--accent-spark)" : "var(--text-muted)",
                  fontWeight: 600,
                }}>
                  {isWholesale ? "Wholesale Margin Discounts Active" : "Individual Retail Purchase"}
                </span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                background: "#f3efe7",
                padding: "4px",
                borderRadius: "3px",
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMode("retail");
                    setQuantity(1);
                  }}
                  style={{
                    padding: "10px",
                    fontSize: "12px",
                    fontWeight: 700,
                    borderRadius: "2px",
                    backgroundColor: !isWholesale ? "#141414" : "transparent",
                    color: !isWholesale ? "#ffffff" : "var(--text-muted)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  RETAIL ORDER
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMode("wholesale");
                    setQuantity(defaultMoq);
                  }}
                  style={{
                    padding: "10px",
                    fontSize: "12px",
                    fontWeight: 700,
                    borderRadius: "2px",
                    backgroundColor: isWholesale ? "var(--accent-spark)" : "transparent",
                    color: isWholesale ? "#ffffff" : "var(--text-muted)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  WHOLESALE PACK (MOQ {defaultMoq})
                </button>
              </div>
            </div>

            {/* Pricing Box */}
            <div style={{
              background: isWholesale ? "rgba(200, 90, 23, 0.05)" : "#ffffff",
              border: isWholesale ? "1px solid rgba(200, 90, 23, 0.25)" : "1px solid var(--border-light)",
              borderRadius: "4px",
              padding: "24px",
              marginBottom: "28px",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    {isWholesale ? "Wholesale Unit Price" : "Retail Price"}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "4px" }}>
                    <span style={{
                      fontSize: "32px",
                      fontWeight: 800,
                      color: isWholesale ? "var(--accent-spark)" : "var(--text-main)",
                    }}>
                      {formatCurrency(effectiveUnitPrice)}
                    </span>
                    {isWholesale && (
                      <span style={{ fontSize: "16px", color: "#8a857d", textDecoration: "line-through" }}>
                        {formatCurrency(product.retail_price)}
                      </span>
                    )}
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      / unit (Incl. GST)
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Carton Subtotal ({currentQty} pcs)
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)", marginTop: "4px" }}>
                    {formatCurrency(lineTotal)}
                  </div>
                </div>
              </div>

              {isWholesale && wholesaleSavings > 0 && (
                <div style={{
                  marginTop: "16px",
                  paddingTop: "14px",
                  borderTop: "1px dashed rgba(200, 90, 23, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "13px",
                  color: "var(--accent-green)",
                  fontWeight: 700,
                }}>
                  <span>Your Wholesale Savings on this order:</span>
                  <span>+{formatCurrency(wholesaleSavings)}</span>
                </div>
              )}
            </div>

            {/* Wholesale Tier Table (if in wholesale mode) */}
            {isWholesale && product.wholesale_tiers && (
              <div style={{ marginBottom: "28px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px", color: "var(--text-main)" }}>
                  Volume Tier Thresholds (Automatic Quantity Breaks)
                </div>
                <div style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: "3px",
                  overflow: "hidden",
                  fontSize: "12px",
                  background: "#fff",
                }}>
                  {product.wholesale_tiers.map((t, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 16px",
                        borderBottom: idx < product.wholesale_tiers.length - 1 ? "1px solid var(--border-light)" : "none",
                        backgroundColor: currentQty >= t.min_qty ? "rgba(200, 90, 23, 0.08)" : "#fff",
                        fontWeight: currentQty >= t.min_qty ? 700 : 400,
                      }}
                    >
                      <span>{t.tier_label || `${t.min_qty}+ units`}</span>
                      <span style={{ color: "var(--accent-spark)", fontWeight: 700 }}>
                        {formatCurrency(t.unit_price)} / unit
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              {/* Stepper */}
              <div style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid var(--border-light)",
                borderRadius: "3px",
                background: "#ffffff",
              }}>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(isWholesale ? defaultMoq : 1, (prev || 1) - (isWholesale ? 5 : 1)))}
                  style={{ padding: "14px 18px", fontWeight: 700, fontSize: "16px" }}
                >
                  -
                </button>
                <span style={{ padding: "14px 20px", fontWeight: 800, fontSize: "16px", minWidth: "44px", textAlign: "center" }}>
                  {currentQty}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => (prev || 1) + (isWholesale ? 5 : 1))}
                  style={{ padding: "14px 18px", fontWeight: 700, fontSize: "16px" }}
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  backgroundColor: isAdded ? "var(--accent-green)" : "#141414",
                  color: "#ffffff",
                  padding: "16px 28px",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all var(--transition-fast)",
                  minWidth: "200px",
                }}
              >
                {isAdded ? (
                  <>
                    <Check size={16} /> ADDED TO BAG
                  </>
                ) : (
                  <>
                    <Layers size={16} /> ADD TO BAG ({currentQty} PCS)
                  </>
                )}
              </button>

              {/* Instant Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="btn-spark"
                style={{
                  padding: "16px 24px",
                  fontSize: "13px",
                  fontWeight: 700,
                  borderRadius: "2px",
                }}
              >
                BUY NOW VIA RAZORPAY
              </button>
            </div>

            {/* Trust Seals */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              paddingTop: "20px",
              borderTop: "1px solid var(--border-light)",
              fontSize: "12px",
              color: "var(--text-muted)",
              flexWrap: "wrap",
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Truck size={15} color="var(--accent-spark)" /> Free Express Dispatch Over ₹1,999
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Lock size={15} color="var(--accent-spark)" /> Razorpay SSL Encryption
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Building2 size={15} color="var(--accent-spark)" /> 18% Input GST Credit Invoice
              </span>
            </div>
          </div>
        </div>

        {/* Technical Specifications Accordion Tabs */}
        <section style={{
          marginTop: "80px",
          backgroundColor: "#ffffff",
          borderRadius: "4px",
          border: "1px solid var(--border-light)",
          overflow: "hidden",
        }}>
          {/* Tab Headers */}
          <div style={{
            display: "flex",
            borderBottom: "1px solid var(--border-light)",
            backgroundColor: "#faf9f6",
          }}>
            <button
              onClick={() => setActiveTab("specs")}
              style={{
                padding: "18px 28px",
                fontSize: "13px",
                fontWeight: 700,
                color: activeTab === "specs" ? "var(--text-main)" : "var(--text-muted)",
                borderBottom: activeTab === "specs" ? "2px solid #141414" : "none",
                background: activeTab === "specs" ? "#ffffff" : "transparent",
              }}
            >
              TECHNICAL SPECIFICATIONS
            </button>
            <button
              onClick={() => setActiveTab("wholesale")}
              style={{
                padding: "18px 28px",
                fontSize: "13px",
                fontWeight: 700,
                color: activeTab === "wholesale" ? "var(--text-main)" : "var(--text-muted)",
                borderBottom: activeTab === "wholesale" ? "2px solid #141414" : "none",
                background: activeTab === "wholesale" ? "#ffffff" : "transparent",
              }}
            >
              WHOLESALE & PACKAGING SPECS
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              style={{
                padding: "18px 28px",
                fontSize: "13px",
                fontWeight: 700,
                color: activeTab === "shipping" ? "var(--text-main)" : "var(--text-muted)",
                borderBottom: activeTab === "shipping" ? "2px solid #141414" : "none",
                background: activeTab === "shipping" ? "#ffffff" : "transparent",
              }}
            >
              DISPATCH & GST COMPLIANCE
            </button>
          </div>

          {/* Tab Body */}
          <div style={{ padding: "36px" }}>
            {activeTab === "specs" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", fontSize: "14px" }} className="specs-grid">
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>Material</div>
                  <div style={{ fontWeight: 600, marginTop: "2px" }}>Aerospace-Grade Alloy / 316L Stainless Steel Shell</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>Ignition Mechanism</div>
                  <div style={{ fontWeight: 600, marginTop: "2px" }}>Precision Flint Wheel with Replaceable Flint Springs</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>Weight & Balance</div>
                  <div style={{ fontWeight: 600, marginTop: "2px" }}>{product.weight_grams} grams (Solid Pocket Form)</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>Fuel System</div>
                  <div style={{ fontWeight: 600, marginTop: "2px" }}>Standard Universal Butane Valve (Bottom Refill Port)</div>
                </div>
              </div>
            )}

            {activeTab === "wholesale" && (
              <div style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-muted)" }}>
                <p style={{ marginBottom: "12px" }}>
                  <strong>Master Carton Packaging:</strong> Each individual lighter comes enclosed in an embossed Ember & Co. presentation gift tin with warranty card. Wholesale orders of 20+ units are packed in reinforced corrugated shipping master cartons.
                </p>
                <p>
                  <strong>Branding & Custom Engraving:</strong> Available for volume orders over 100 units. Inquire via the Wholesale Portal for custom corporate insignia or boutique co-branding.
                </p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-muted)" }}>
                <p style={{ marginBottom: "12px" }}>
                  <strong>Freight & Delivery:</strong> Dispatched via Bluedart Air and Delhivery Express. Retail orders ship within 24 hours. Wholesale carton shipments include tracking and road freight insurance.
                </p>
                <p>
                  <strong>GST Invoicing:</strong> Registered Indian businesses can enter their 15-digit GSTIN at checkout. System automatically issues an official GST Tax Invoice with 18% HSN 9613 input credit.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Related Products Carousel */}
        <section style={{ marginTop: "90px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-spark)" }}>
                COMPLEMENTARY PIECES
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 600, marginTop: "4px" }}>
                Explore Other Finishes
              </h2>
            </div>
            <Link href="/collection" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)", textDecoration: "underline" }}>
              View Complete Collection →
            </Link>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}>
            {allProducts.filter((p) => p.slug !== product.slug).slice(0, 3).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <WholesaleInquiryModal
        isOpen={isWholesaleModalOpen}
        onClose={() => setIsWholesaleModalOpen(false)}
      />

      <style jsx>{`
        @media (max-width: 880px) {
          .pdp-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .specs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
