import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold font-grotesk text-gray-900 sm:text-5xl">
              Privacy <span className="text-orange-500">Policy</span>
            </h2>
          </div>
          <div className="mt-12 font-grotesk">
            <p className="text-lg text-gray-600">
              <strong>Effective Date:</strong> 28 – Oct - 2025
            </p>
            <p className="text-lg text-gray-600">
              <strong>Last Updated:</strong> Welcome to Cabnex (operated by Nexfleet Tech Solutions Pvt. Ltd.).Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.cabnex.in or use our travel and transport services. Please read this policy carefully to understand our practices.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">1. Information We Collect</h3>
            <p className="mt-4 text-lg text-gray-600">
              We collect personal and non-personal information to provide you with a seamless experience.
            </p>
            <h4 className="mt-4 text-xl font-bold text-gray-900">a) Personal Information:</h4>
            <p className="mt-2 text-lg text-gray-600">
              When you book a service, contact us, or register on our platform, we may collect:
            </p>
            <ul className="list-disc list-inside mt-2 text-lg text-gray-600">
              <li>Full name</li>
              <li>Contact number</li>
              <li>Email address</li>
              <li>Pickup and drop-off locations</li>
              <li>Travel details (dates, destinations, preferences)</li>
              <li>Payment information (processed securely via third-party gateways)</li>
            </ul>
            <h4 className="mt-4 text-xl font-bold text-gray-900">b) Non-Personal Information:</h4>
            <ul className="list-disc list-inside mt-2 text-lg text-gray-600">
              <li>Browser type and version</li>
              <li>IP address</li>
              <li>Device information</li>
              <li>Cookies and analytics data to improve website performance</li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">2. How We Use Your Information</h3>
            <p className="mt-4 text-lg text-gray-600">
              We use the collected information for purposes including:
            </p>
            <ul className="list-disc list-inside mt-2 text-lg text-gray-600">
              <li>To confirm bookings and provide travel services</li>
              <li>To communicate updates, confirmations, and offers</li>
              <li>To improve our website, customer experience, and fleet services</li>
              <li>To ensure compliance with legal and regulatory obligations</li>
              <li>For customer support and feedback</li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">3. Information Sharing and Disclosure</h3>
            <p className="mt-4 text-lg text-gray-600">
              We do not sell or rent your personal information.However, we may share your data:
            </p>
            <ul className="list-disc list-inside mt-2 text-lg text-gray-600">
              <li>With our drivers, partner vendors, or service affiliates for operational purposes</li>
              <li>With payment processors for secure transactions</li>
              <li>When required by law, regulation, or government authorities</li>
            </ul>
            <p className="mt-2 text-lg text-gray-600">
              All partners and affiliates are bound by confidentiality agreements to protect your information.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">4. Data Security</h3>
            <p className="mt-4 text-lg text-gray-600">
              We adopt appropriate security measures to prevent unauthorized access, alteration, disclosure, or destruction of your personal data.Our website uses SSL encryption, and sensitive data (like payment details) is transmitted securely through certified payment gateways.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">5. Cookies and Tracking Technologies</h3>
            <p className="mt-4 text-lg text-gray-600">
              Our website uses cookies to:
            </p>
            <ul className="list-disc list-inside mt-2 text-lg text-gray-600">
              <li>Improve browsing experience</li>
              <li>Remember preferences</li>
              <li>Analyze website traffic via tools such as Google Analytics</li>
            </ul>
            <p className="mt-2 text-lg text-gray-600">
              You can disable cookies through your browser settings, but certain website features may not function properly.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">6. Your Rights</h3>
            <p className="mt-4 text-lg text-gray-600">
              You have the right to:
            </p>
            <ul className="list-disc list-inside mt-2 text-lg text-gray-600">
              <li>Access, update, or delete your personal data</li>
              <li>Withdraw consent to data usage (subject to service limitations)</li>
              <li>Opt out of promotional communications at any time</li>
            </ul>
            <p className="mt-2 text-lg text-gray-600">
              To exercise these rights, contact us at info@cabnex.in
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">7. Third-Party Links</h3>
            <p className="mt-4 text-lg text-gray-600">
              Our website may contain links to third-party websites.Cabnex is not responsible for the content or privacy practices of these external sites. We recommend reviewing their respective privacy policies.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">8. Policy Updates</h3>
            <p className="mt-4 text-lg text-gray-600">
              Cabnex reserves the right to modify this Privacy Policy at any time. Updates will be posted on this page with the revised effective date. Continued use of our services indicates acceptance of any changes.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">9. Contact Us</h3>
            <p className="mt-4 text-lg text-gray-600">
              If you have any questions or concerns about this Privacy Policy or our data handling practices, please contact:
            </p>
            <address className="mt-4 not-italic text-lg text-gray-600">
              Nexfleet Tech Solutions Pvt. Ltd.<br />
              Email: info@cabnex.in<br />
              Phone: +91 96672 84400<br />
              Website: www.cabnex.in<br />
              Address: MIQB, C 25, Sector 58, Noida 201301
            </address>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
