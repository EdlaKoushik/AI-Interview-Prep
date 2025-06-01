import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const plans = [
  {
    name: "Free",
    price: "₹0/mo",
    features: [
      "3 mock interviews per month",
      "Basic AI feedback",
      "Text, audio, and video modes",
      "Dashboard & history",
    ],
    highlight: false,
  },
  {
    name: "Premium",
    price: "₹499/mo",
    features: [
      "Unlimited mock interviews",
      "Downloadable feedback reports (PDF)",
      "Job-wise tailoring & analytics",
      "Priority support",
      "Admin-defined features",
    ],
    highlight: true,
  },
];

const SubscriptionPlan = ({ currentPlan, onUpgrade }) => (
  <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch w-full">
    {plans.map((plan) => (
      <div
        key={plan.name}
        className={`flex-1 bg-white rounded-2xl shadow-xl p-8 border-2 ${
          plan.highlight ? "border-[#6c47ff]" : "border-gray-200"
        } flex flex-col items-center`}
      >
        <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-[#6c47ff]" : "text-gray-800"}`}>{plan.name}</h3>
        <div className="text-3xl font-extrabold mb-4">{plan.price}</div>
        <ul className="mb-6 w-full">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-gray-700 mb-2">
              <FaCheckCircle className="text-green-500" /> {f}
            </li>
          ))}
        </ul>
        {currentPlan === plan.name ? (
          <span className="px-6 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">Current Plan</span>
        ) : plan.highlight ? (
          <button
            className="px-8 py-3 rounded-lg bg-[#6c47ff] text-white font-bold shadow hover:bg-[#4f2fcf] transition text-lg"
            onClick={onUpgrade}
          >
            Upgrade Now
          </button>
        ) : null}
      </div>
    ))}
  </div>
);

export default SubscriptionPlan;
