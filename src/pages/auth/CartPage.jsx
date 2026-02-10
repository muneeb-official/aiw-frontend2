// src/pages/auth/CartPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useSubscription } from "../../services/SubscriptionContext";
import backgroundImage from "../../assets/Background.png";

// Icons
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#10B981"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#10B981"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CheckmarkIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#10B981"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex justify-center">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
  </div>
);

// Empty Cart State
const EmptyCartState = ({ onBrowsePlans }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="text-center">
      <svg
        className="w-20 h-20 mx-auto mb-4 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      <h2
        className="text-2xl font-semibold text-gray-900 mb-2"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        Your cart is empty
      </h2>
      <p className="text-gray-500 mb-6">
        Browse our plans and find the perfect fit for you.
      </p>
      <button
        onClick={onBrowsePlans}
        className="px-6 py-3 bg-[#4F46E5] text-white font-medium rounded-xl hover:bg-[#4338CA] transition-colors"
      >
        Browse Plans
      </button>
    </div>
  </div>
);

const CartPage = () => {
  const navigate = useNavigate();
  const {
    selectedPlan,
    selectedSEO,
    selectedAgent,
    calculateTotal,
    proceedToCheckout,
    checkoutLoading,
    checkoutError,
    clearCart,
  } = useSubscription();

  const [paymentType, setPaymentType] = useState("yearly");
  const [currency, setCurrency] = useState("GBP");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const currencies = ["GBP", "USD", "EUR"];

  // Check if cart is empty
  if (!selectedPlan) {
    return (
      <div
        className="min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Header variant="simple" />
        <main className="w-full bg-white mt-6">
          <div className="max-w-6xl mx-auto px-6 py-8 mt-6">
            <EmptyCartState onBrowsePlans={() => navigate("/choose-plan")} />
          </div>
        </main>
      </div>
    );
  }

  // Calculate prices
  const basePrice = selectedPlan.price + (selectedSEO?.price || 0);
  const monthlyPrice = basePrice;
  const yearlyPrice = Math.round(basePrice * 0.8); // 20% discount
  const currentPrice = paymentType === "yearly" ? yearlyPrice : monthlyPrice;
  const tax = Math.round(currentPrice * 0.1); // 10% tax estimate
  const total = currentPrice + tax;

  const isPremium = selectedPlan?.bothAgents;

  const handleProceedToPay = async () => {
    await proceedToCheckout();
  };

  return (
    <div
      className="min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header variant="simple" />

      <main className="w-full bg-white mt-6">
        <div className="max-w-6xl mx-auto px-6 py-8 mt-6">
          <h1
            className="text-3xl font-semibold text-gray-900 mb-8"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            In your Cart
          </h1>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Left Column - Plan Details */}
            <div className="space-y-6">
              {/* Main Plan Card */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-700">
                    {selectedPlan.name}
                  </h3>
                  {selectedPlan.isBestseller && (
                    <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded">
                      BESTSELLER
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <span className="text-5xl font-bold text-gray-900">
                    £{selectedPlan.price}
                  </span>
                  <span className="text-gray-500">/ month per seat</span>
                </div>

                {!isPremium && (
                  <p className="text-gray-700 mb-4">
                    <span className="text-[#10B981] font-medium">
                      Agent Type:
                    </span>{" "}
                    {selectedAgent} Lead Builder
                  </p>
                )}

                {isPremium && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-700 italic">
                    Both B2C Lead Builder Agent & B2B Lead Builder Agent{" "}
                    <span className="font-medium">
                      will be included in this plan
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <p className="font-medium text-gray-900 mb-3">You will get</p>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <CheckIcon /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => navigate("/choose-plan")}
                    className="flex items-center gap-1 text-[#4F46E5] font-medium hover:text-[#4338CA] transition-colors"
                  >
                    Change Plan <ArrowIcon />
                  </button>
                </div>
              </div>

              {/* SEO Addon Card */}
              {selectedSEO && (
                <div className="border border-gray-200 rounded-xl p-6">
                  <p className="text-gray-500 text-sm">{selectedSEO.name}</p>
                  <p className="text-4xl font-bold text-gray-900 my-2">
                    £{selectedSEO.price}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 mb-4">
                    <CheckIcon /> {selectedSEO.words}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      SEO Blog & Content Engine
                    </span>
                    <button
                      onClick={() => navigate("/choose-plan")}
                      className="flex items-center gap-1 text-[#4F46E5] font-medium hover:text-[#4338CA]"
                    >
                      Change <ArrowIcon />
                    </button>
                  </div>
                </div>
              )}

              {/* Free SEO Tier for Premium */}
              {isPremium && (
                <div className="border border-gray-200 rounded-xl p-6">
                  <p className="text-gray-500 text-sm">SEO Tier - Included</p>
                  <p className="text-4xl font-bold text-gray-900 my-2">£0</p>
                  <p className="flex items-center gap-2 text-gray-600 mb-4">
                    <CheckIcon /> Unlimited Words
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#10B981] font-medium">
                      Included with your plan
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Payment Options */}
            <div className="space-y-4">
              {/* Currency Selector */}
              <div className="flex justify-end">
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowCurrencyDropdown(!showCurrencyDropdown)
                    }
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <span className="text-gray-500">Currency</span>
                    <span className="font-medium">{currency}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {showCurrencyDropdown && (
                    <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
                      {currencies.map((curr) => (
                        <button
                          key={curr}
                          onClick={() => {
                            setCurrency(curr);
                            setShowCurrencyDropdown(false);
                          }}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Type Options */}
              <button
                onClick={() => setPaymentType("monthly")}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${
                  paymentType === "monthly"
                    ? "border-[#4F46E5] bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div>
                  <p className="text-gray-500 text-sm">Pay monthly</p>
                  <p className="text-xl font-bold text-gray-900">
                    £{monthlyPrice}/month
                  </p>
                </div>
                {paymentType === "monthly" && <CheckmarkIcon />}
              </button>

              <button
                onClick={() => setPaymentType("yearly")}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${
                  paymentType === "yearly"
                    ? "border-[#4F46E5] bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-gray-500 text-sm">Pay yearly</p>
                    <p className="text-xl font-bold text-gray-900">
                      £{yearlyPrice}/month
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-[#10B981] text-white text-xs rounded font-medium">
                    Save 20%
                  </span>
                </div>
                {paymentType === "yearly" && <CheckmarkIcon />}
              </button>

              {/* Security Note */}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <LockIcon />
                <span>Secured payment with Stripe</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Plan Cost</span>
                  <span>£{currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span>£{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Error Message */}
              {checkoutError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{checkoutError}</p>
                  {checkoutError.includes("login") && (
                    <button
                      onClick={() =>
                        navigate("/login", { state: { returnTo: "/cart" } })
                      }
                      className="mt-2 text-[#4F46E5] text-sm font-medium hover:underline"
                    >
                      Click here to login
                    </button>
                  )}
                </div>
              )}

              {/* Terms Note */}
              <p className="text-gray-500 text-sm">
                By clicking "Proceed To Pay", you agree to be charged £
                {currentPrice} every{" "}
                {paymentType === "yearly" ? "year" : "month"}, unless you
                cancel.
              </p>

              {/* Pay Button */}
              <button
                onClick={handleProceedToPay}
                disabled={checkoutLoading}
                className="w-full h-12 bg-[#10B981] hover:bg-[#059669] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center"
              >
                {checkoutLoading ? <LoadingSpinner /> : "Proceed To Pay"}
              </button>

              {/* Clear Cart */}
              <button
                onClick={() => {
                  clearCart();
                  navigate("/choose-plan");
                }}
                className="w-full text-center text-gray-500 text-sm hover:text-gray-700"
              >
                Clear cart and browse plans
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
