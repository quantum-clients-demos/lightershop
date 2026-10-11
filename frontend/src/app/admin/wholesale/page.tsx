"use client";

import React, { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { WholesaleApplication } from "@/types";
import { formatDate } from "@/lib/formatters";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function AdminWholesalePage() {
  const [applications, setApplications] = useState<WholesaleApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [actionMessage, setActionMessage] = useState("");

  const loadApplications = () => {
    setIsLoading(true);
    api
      .listWholesaleApplications()
      .then(setApplications)
      .catch((err) => console.error("Failed to load applications:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleReview = async (appId: number, status: "approved" | "rejected") => {
    try {
      await api.reviewApplication(appId, status);
      setActionMessage(`Application #${appId} marked as ${status.toUpperCase()}!`);
      setTimeout(() => setActionMessage(""), 3500);
      loadApplications();
    } catch (err: any) {
      alert(err.message || "Failed to update application status");
    }
  };

  const filteredApplications = useMemo(() => {
    let list = [...applications];

    if (selectedStatus !== "all") {
      list = list.filter((a) => a.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.business_name.toLowerCase().includes(q) ||
          a.contact_name.toLowerCase().includes(q) ||
          a.contact_email.toLowerCase().includes(q) ||
          a.gstin.toLowerCase().includes(q) ||
          (a.business_type || "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [applications, selectedStatus, searchQuery]);

  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const approvedCount = applications.filter((a) => a.status === "approved").length;

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
            B2B MERCHANT PARTNERSHIPS
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 3.5vw, 36px)",
            fontWeight: 600,
            color: "var(--text-main)",
          }}>
            Wholesale Dealer Applications
          </h1>
        </div>

        <button
          onClick={loadApplications}
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
          <span>Refresh Applications</span>
        </button>
      </div>

      {actionMessage && (
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
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Summary Stat Strips */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "28px",
      }}>
        <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Total Inquiries
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: "var(--text-main)" }}>
            {applications.length} partners
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Pending Verification
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: pendingCount > 0 ? "var(--accent-spark)" : "var(--text-main)" }}>
            {pendingCount} awaiting review
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Approved Wholesale Dealers
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px", color: "var(--accent-green)" }}>
            {approvedCount} active dealers
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {[
            { id: "all", label: `All (${applications.length})` },
            { id: "pending", label: `Pending (${pendingCount})` },
            { id: "approved", label: `Approved (${approvedCount})` },
            { id: "rejected", label: `Rejected` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id as any)}
              style={{
                padding: "7px 14px",
                fontSize: "12px",
                fontWeight: selectedStatus === tab.id ? 700 : 500,
                borderRadius: "2px",
                backgroundColor: selectedStatus === tab.id ? "#141414" : "#f4f1eb",
                color: selectedStatus === tab.id ? "#ffffff" : "var(--text-main)",
                border: "1px solid var(--border-light)",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          minWidth: "260px",
          flex: 1,
          maxWidth: "380px",
        }}>
          <Search size={15} style={{ position: "absolute", left: "12px", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search business name, GSTIN, contact..."
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
      </div>

      {/* Applications Cards Grid */}
      {isLoading && applications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          Loading wholesale applications...
        </div>
      ) : filteredApplications.length === 0 ? (
        <div style={{
          backgroundColor: "#ffffff",
          padding: "60px 20px",
          borderRadius: "4px",
          border: "1px solid var(--border-light)",
          textAlign: "center",
          color: "var(--text-muted)",
        }}>
          No wholesale dealer applications match the current criteria.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid var(--border-light)",
                borderRadius: "4px",
                padding: "24px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "14px",
                marginBottom: "16px",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-main)" }}>
                      {app.business_name}
                    </h3>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "2px",
                      background:
                        app.status === "approved"
                          ? "rgba(45, 138, 84, 0.1)"
                          : app.status === "rejected"
                          ? "#fde8e8"
                          : "rgba(200, 90, 23, 0.1)",
                      color:
                        app.status === "approved"
                          ? "var(--accent-green)"
                          : app.status === "rejected"
                          ? "#9b1c1c"
                          : "var(--accent-spark)",
                      textTransform: "uppercase",
                    }}>
                      {app.status}
                    </span>
                  </div>

                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Category: <strong>{app.business_type || "Retailer Chain"}</strong> • Submitted on {formatDate(app.created_at)}
                  </div>
                </div>

                {/* Approve / Reject Actions */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {app.status !== "approved" && (
                    <button
                      onClick={() => handleReview(app.id, "approved")}
                      style={{
                        padding: "8px 16px",
                        fontSize: "12px",
                        fontWeight: 700,
                        backgroundColor: "var(--accent-green)",
                        color: "#ffffff",
                        borderRadius: "2px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <CheckCircle2 size={14} />
                      <span>APPROVE DEALER</span>
                    </button>
                  )}

                  {app.status !== "rejected" && (
                    <button
                      onClick={() => handleReview(app.id, "rejected")}
                      style={{
                        padding: "8px 16px",
                        fontSize: "12px",
                        fontWeight: 700,
                        backgroundColor: "#9b1c1c",
                        color: "#ffffff",
                        borderRadius: "2px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <XCircle size={14} />
                      <span>REJECT</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of Partner Credentials */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "14px",
                backgroundColor: "#faf9f6",
                padding: "16px",
                borderRadius: "3px",
                border: "1px solid var(--border-light)",
                fontSize: "13px",
              }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Tax Identification (GSTIN)
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>
                    {app.gstin}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Contact Person
                  </div>
                  <div style={{ fontWeight: 600, marginTop: "2px" }}>
                    {app.contact_name}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Contact Communications
                  </div>
                  <div style={{ marginTop: "2px" }}>
                    <a href={`mailto:${app.contact_email}`} style={{ color: "var(--accent-spark)" }}>
                      {app.contact_email}
                    </a>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{app.contact_phone}</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Est. Monthly Purchase
                  </div>
                  <div style={{ fontWeight: 600, marginTop: "2px" }}>
                    {app.estimated_monthly_volume || "100-300 units"}
                  </div>
                </div>
              </div>

              {app.notes && (
                <div style={{ marginTop: "12px", fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic" }}>
                  Notes: &ldquo;{app.notes}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
