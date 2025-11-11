import React from "react";
import { FaUserPlus } from "react-icons/fa";

export default function AgentRegistrationSection() {
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <div className="mb-12">
          <div className="linrr w-16 h-1 bg-orange-500 mx-auto mb-4"></div>
          <span className="text-sm uppercase font-grotesk text-orange-500 tracking-widest">
            Join Our Team
          </span>
          <h2 className="text-3xl md:text-5xl font-grotesk text-black font-extrabold leading-tight mt-2 mb-4">
            Become an <span className="text-orange-600">Agent</span> Today
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Partner with Cabnex to deliver premium car rental services to your clients across India.
            Enjoy flexible earnings, reliable support, and access to our extensive fleet — from sedans to luxury coaches.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Benefit 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <FaUserPlus className="text-orange-500 text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-grotesk font-semibold text-black mb-2">
              Easy Onboarding
            </h3>
            <p className="text-slate-600 text-sm">
              Register your business in just a few minutes with our simple KYC-based sign-up process
              and start offering verified rental services immediately.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <FaUserPlus className="text-orange-500 text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-grotesk font-semibold text-black mb-2">
              Competitive Earnings
            </h3>
            <p className="text-slate-600 text-sm">
              Earn attractive commissions for every successful booking made through your network —
              whether for local rentals, transfers, or outstation trips.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <FaUserPlus className="text-orange-500 text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-grotesk font-semibold text-black mb-2">
              24/7 Support
            </h3>
            <p className="text-slate-600 text-sm">
              Our dedicated team is available round the clock to ensure smooth operations,
              quick resolutions, and happy clients.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <a
          href="/vendor-registration"
          className="inline-block bg-orange-500 text-white font-grotesk font-semibold py-3 px-8 rounded-full hover:bg-orange-600 transition"
        >
          Join as an Agent Now
        </a>

        <p className="mt-6 text-slate-700 font-grotesk">
          Ready to get started? <br />
          <span className="text-orange-600 font-semibold">Start earning with Cabnex today.</span>
        </p>
      </div>
    </section>
  );
}
