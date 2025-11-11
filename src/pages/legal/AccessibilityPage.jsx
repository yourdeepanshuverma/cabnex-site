import React from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ScrollToTop from "../../utils/scroll-to-top";

const AccessibilityPage = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold font-grotesk text-gray-900 sm:text-5xl">
              Accessibility <span className="text-orange-500">Statement</span>
            </h2>
          </div>
          <div className="mt-12 font-grotesk">
            <p className="text-lg text-gray-600">
              <strong>Effective Date:</strong> 28 Oct 2025
            </p>
            <p className="text-lg text-gray-600">
              <strong>Last Updated:</strong> At Cabnex (Nexfleet Tech Solutions
              Pvt. Ltd.), we are committed to ensuring that our website,
              www.cabnex.in, is accessible to all users — including people with
              disabilities. We strive to provide an inclusive digital experience
              so that everyone can easily access information about our travel
              and transport services.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              1. Our Commitment
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Cabnex is continuously working towards improving website
              accessibility and usability for all visitors by following the Web
              Content Accessibility Guidelines (WCAG) 2.1, Level AA standards.
              These guidelines explain how to make web content more accessible
              to people with various abilities, including those using assistive
              technologies such as screen readers or keyboard navigation.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              2. Accessibility Features
            </h3>
            <p className="mt-4 text-lg text-gray-600">Our website includes:</p>
            <ul className="list-disc list-inside mt-2 text-lg text-gray-600">
              <li>
                Keyboard-friendly navigation for users who prefer not to use a
                mouse.
              </li>
              <li>Clear contrast and readable fonts to enhance visibility.</li>
              <li>Alt text for images to support screen readers.</li>
              <li>
                Responsive design for access across mobile, tablet, and desktop
                devices.
              </li>
              <li>Descriptive links and buttons for easier interaction.</li>
            </ul>
            <p className="mt-2 text-lg text-gray-600">
              We aim to make every feature on our site usable by as many people
              as possible.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              3. Ongoing Efforts
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              While we strive for full compliance, some content or third-party
              features may not yet fully adhere to the highest accessibility
              standards. We are continuously reviewing and upgrading our website
              to address such areas. If you encounter any difficulty accessing
              information or using our website, please let us know so we can
              improve.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              4. Feedback and Contact Information
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              We welcome your feedback on our website’s accessibility. If you
              experience any accessibility barriers or need information in an
              alternative format, please contact us:
            </p>
            <address className="mt-4 not-italic text-lg text-gray-600">
              Cabnex – Nexfleet Tech Solutions Pvt. Ltd.
              <br />
              📞 +91 96672 84400
              <br />
              ✉️ info@cabnex.in
              <br />
              🌐 www.cabnex.in
              <br />
              📍 MIQB, C 25, Sector 58, Noida 201301
            </address>
            <p className="mt-4 text-lg text-gray-600">
              We will make all reasonable efforts to accommodate your request
              and ensure your access needs are met.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              5. Third-Party Services
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Our website may include links or embedded content from third-party
              websites or tools (e.g., maps, payment gateways). While we do not
              control these external services, we encourage all partners to
              maintain accessibility standards consistent with our own.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              6. Continuous Improvement
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Cabnex’s goal is to make travel planning and booking accessible to
              everyone. We regularly update our digital systems and customer
              support resources to serve our users better and uphold inclusivity
              in every interaction.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccessibilityPage;
