"use client";

import React, { useState, useEffect } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesBar } from "@/components/FeaturesBar";
import { ProductGrid } from "@/components/ProductGrid";
import { DetailsDarkSection } from "@/components/DetailsDarkSection";
import { ProductQuickViewModal } from "@/components/ProductQuickViewModal";
import { CartDrawer } from "@/components/CartDrawer";
import { WholesaleInquiryModal } from "@/components/WholesaleInquiryModal";
import { Footer } from "@/components/Footer";
import { Product } from "@/types";
import { api } from "@/lib/api";

// Fallback seed catalog in case backend is warming up
const initialCatalog: Product[] = [
  {
    id: 1,
    name: "Classic Steel",
    slug: "classic-steel",
    tagline: "Everyday objects. Considered design.",
    description: "Crafted from aerospace-grade brushed stainless steel with precision flint wheel ignition. A balanced, tactile weight designed for longevity.",
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
    description: "A deep matte black PVD coating offers unmatched fingerprint resistance and a velvety tactile handfeel. Designed for discreet carry.",
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
    description: "A refined tribute to mid-century heirloom craftsmanship. Brushed champagne gold finish with custom-engineered wind-resistant wick.",
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

export default function StorefrontPage() {
  const [products, setProducts] = useState<Product[]>(initialCatalog);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);

  useEffect(() => {
    api
      .getProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.warn("Using offline catalog fallback:", err);
      });
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navigation */}
      <Navbar onOpenWholesaleModal={() => setIsWholesaleModalOpen(true)} />

      {/* Hero Showcase Section */}
      <HeroSection />

      {/* 3 Highlights Bar */}
      <FeaturesBar />

      {/* Product Catalog Grid */}
      <ProductGrid
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
        onOpenWholesaleModal={() => setIsWholesaleModalOpen(true)}
      />

      {/* Luxury Dark Details Section */}
      <DetailsDarkSection />

      {/* Footer */}
      <Footer />

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Wholesale Registration Modal */}
      <WholesaleInquiryModal
        isOpen={isWholesaleModalOpen}
        onClose={() => setIsWholesaleModalOpen(false)}
      />
    </main>
  );
}
