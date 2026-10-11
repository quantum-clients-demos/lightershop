import React from "react";
import { Sparkles, CheckSquare, ArrowUpRight } from "lucide-react";

export function FeaturesBar() {
  const features = [
    {
      icon: <Sparkles size={16} color="var(--accent-spark)" />,
      title: "Curated collection",
      description: "Styles for different preferences",
    },
    {
      icon: <CheckSquare size={16} color="var(--text-main)" />,
      title: "Simple checkout",
      description: "Clear order and Razorpay steps",
    },
    {
      icon: <ArrowUpRight size={16} color="var(--accent-spark)" />,
      title: "Personal service",
      description: "Questions? We're here to help",
    },
  ];

  return (
    <section style={{
      borderBottom: "1px solid var(--border-light)",
      backgroundColor: "var(--bg-primary)",
      padding: "28px 0",
    }}>
      <div className="container features-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "32px",
      }}>
        {features.map((f, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
          }}>
            <div style={{
              marginTop: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {f.icon}
            </div>
            <div>
              <div style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--text-main)",
                letterSpacing: "0.01em",
                marginBottom: "3px",
              }}>
                {f.title}
              </div>
              <div style={{
                fontSize: "13px",
                color: "var(--text-muted)",
              }}>
                {f.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
