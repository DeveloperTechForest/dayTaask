// user/payment/page.jsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import {
  CreditCard,
  Smartphone,
  Wallet,
  ShieldCheck,
  Tag,
  AlertCircle,
  Lock,
  ChevronLeft,
} from "lucide-react";

export default function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId") || "12345";

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const baseAmount = 1999 + 350 + 423; // Service + Materials + GST
  const finalAmount = promoApplied ? 2499 : baseAmount;

  const applyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      router.push(`/user/payment-success?bookingId=${bookingId}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-brand"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-3">
            Complete Payment
          </h1>
          <p className="text-xl text-muted-foreground">
            Secure checkout for Booking #{bookingId}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: Payment Methods */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Lock className="w-7 h-7 text-yellow-500" />
                Select Payment Method
              </h2>

              <div className="space-y-5">
                {/* 1. UPI */}
                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-yellow-500 bg-yellow-500/5 shadow-md"
                      : "border-border hover:border-yellow-500/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="w-5 h-5 text-yellow-500"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">UPI</p>
                        <p className="text-sm text-muted-foreground">
                          GPay, PhonePe, Paytm & more
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                        Recommended
                      </span>
                    </div>
                  </div>
                  {paymentMethod === "upi" && (
                    <div className="mt-6 ml-14 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Enter UPI ID
                        </label>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          className="w-full px-5 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You will receive a payment request on your UPI app
                      </p>
                    </div>
                  )}
                </label>

                {/* 2. Credit/Debit Card */}
                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-yellow-500 bg-yellow-500/5 shadow-md"
                      : "border-border hover:border-yellow-500/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="w-5 h-5 text-yellow-500"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          Credit / Debit Card
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Visa, Mastercard, RuPay
                        </p>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="mt-6 ml-14 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="w-full px-5 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full px-5 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            CVV
                          </label>
                          <input
                            type="password"
                            placeholder="123"
                            maxLength="4"
                            className="w-full px-5 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* 3. Wallet */}
                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "wallet"
                      ? "border-yellow-500 bg-yellow-500/5 shadow-md"
                      : "border-border hover:border-yellow-500/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      checked={paymentMethod === "wallet"}
                      onChange={() => setPaymentMethod("wallet")}
                      className="w-5 h-5 text-yellow-500"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          DayTaask Wallet
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          Available Balance: ₹1,250
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Security Badge */}
              <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-foreground">
                    100% Secure Payments
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your payment information is encrypted and secure. We never
                    store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-6">
                  <h3 className="text-2xl font-bold">Order Summary</h3>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Service Charges
                      </span>
                      <span className="font-semibold">₹1,999</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Materials & Parts
                      </span>
                      <span className="font-semibold">₹350</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span className="font-semibold">₹423</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span className="flex items-center gap-2">
                          <Tag className="w-5 h-5" />
                          Promo Discount
                        </span>
                        <span>-₹273</span>
                      </div>
                    )}
                  </div>

                  <hr className="border-border" />

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-foreground">
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold text-yellow-600">
                      ₹{finalAmount.toLocaleString()}
                    </span>
                  </div>

                  {!promoApplied && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">
                        Have a promo code?
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) =>
                            setPromoCode(e.target.value.toUpperCase())
                          }
                          className="flex-1 px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                        />
                        <button
                          onClick={applyPromo}
                          className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-yellow-500 text-white font-bold text-xl py-5 rounded-xl hover:bg-yellow-600 transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹{finalAmount.toLocaleString()}
                        <Lock className="w-6 h-6" />
                      </>
                    )}
                  </button>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3 text-sm">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-foreground">
                          Cancellation Policy
                        </p>
                        <p className="text-muted-foreground mt-1">
                          Free cancellation up to 4 hours before scheduled time.
                          After that, ₹199 fee applies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
