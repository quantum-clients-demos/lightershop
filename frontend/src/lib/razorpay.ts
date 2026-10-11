import { RazorpayOrderData } from "@/types";
import { api } from "./api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn("Failed to load official Razorpay script. Falling back to simulated checkout.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export interface CheckoutHandlerOptions {
  orderData: RazorpayOrderData;
  orderId: number;
  onSuccess: (paymentResult: any) => void;
  onDismiss?: () => void;
  onError?: (err: any) => void;
}

export async function openRazorpayCheckout({
  orderData,
  orderId,
  onSuccess,
  onDismiss,
  onError,
}: CheckoutHandlerOptions) {
  const isScriptLoaded = await loadRazorpayScript();

  // If Razorpay SDK loaded and is valid non-demo key
  const hasRealKey = orderData.key_id && !orderData.key_id.includes("EMBER_DEMO");

  if (isScriptLoaded && window.Razorpay && hasRealKey) {
    const options = {
      key: orderData.key_id,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "EMBER & CO.",
      description: `Payment for Order #${orderData.order_number}`,
      image: "/images/classic-steel.png",
      order_id: orderData.razorpay_order_id,
      prefill: {
        name: orderData.customer_name,
        email: orderData.customer_email,
        contact: orderData.customer_phone,
      },
      notes: {
        order_id: String(orderId),
        order_number: orderData.order_number,
      },
      theme: {
        color: "#c85a17",
      },
      handler: async function (response: any) {
        try {
          const verifyResult = await api.verifyRazorpayPayment({
            order_id: orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          onSuccess(verifyResult);
        } catch (err) {
          onError?.(err);
        }
      },
      modal: {
        ondismiss: function () {
          onDismiss?.();
        },
      },
    };

    const rzpInstance = new window.Razorpay(options);
    rzpInstance.open();
  } else {
    // Demonstration fallback flow
    // Simulates Razorpay secure payment seamlessly
    try {
      const mockPaymentId = `pay_demo_${Date.now()}`;
      const mockSignature = `sig_demo_${Math.random().toString(36).substring(2)}`;

      const verifyResult = await api.verifyRazorpayPayment({
        order_id: orderId,
        razorpay_order_id: orderData.razorpay_order_id,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: mockSignature,
      });

      onSuccess(verifyResult);
    } catch (err) {
      onError?.(err);
    }
  }
}
