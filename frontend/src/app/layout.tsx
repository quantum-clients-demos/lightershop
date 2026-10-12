import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth/authStore";
import { CartProvider } from "@/features/cart/cartStore";

export const metadata: Metadata = {
  title: "EMBER & CO. | Luxury Pocket Lighters (Retail & Wholesale)",
  description:
    "Curated luxury everyday pocket lighters. Precision mechanical engineering meets timeless tactile finishes. Dual retail & wholesale ordering with Razorpay standard checkout.",
  keywords: [
    "lighters",
    "luxury pocket lighter",
    "wholesale lighters",
    "retail lighter shop",
    "butane lighter",
    "ember and co",
    "razorpay checkout",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
