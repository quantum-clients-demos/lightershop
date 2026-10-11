"use client";

import React from "react";
import { useCart } from "@/features/cart/cartStore";

export function AnnouncementBar() {
  const { storeMode, setStoreMode } = useCart();

  return (
    <div style={{
      backgroundColor: "#111111",
      color: "#eae6dd",
      fontSize: "11px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      padding: "8px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #222222",
      fontWeight: 500,
      flexWrap: "wrap",
      gap: "8px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 auto" }}>
        <span>COMPLIMENTARY SHIPPING ON ORDERS OVER ₹1,999 · BUILT FOR EVERYDAY CARRY</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "10px" }}>
        <span style={{ color: "#8e8a82" }}>PURCHASE MODE:</span>
        <button
          onClick={() => setStoreMode("retail")}
          style={{
            color: storeMode === "retail" ? "#ffffff" : "#777",
            fontWeight: storeMode === "retail" ? 700 : 400,
            textDecoration: storeMode === "retail" ? "underline" : "none",
            textUnderlineOffset: "4px",
            letterSpacing: "0.08em"
          }}
        >
          RETAIL
        </button>
        <span style={{ color: "#444" }}>|</span>
        <button
          onClick={() => setStoreMode("wholesale")}
          style={{
            color: storeMode === "wholesale" ? "#c85a17" : "#777",
            fontWeight: storeMode === "wholesale" ? 700 : 400,
            textDecoration: storeMode === "wholesale" ? "underline" : "none",
            textUnderlineOffset: "4px",
            letterSpacing: "0.08em"
          }}
        >
          WHOLESALE (B2B)
        </button>
      </div>
    </div>
  );
}
