import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';

const LegalNoticePage = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold font-grotesk text-gray-900 sm:text-5xl">
              Legal <span className="text-orange-500">Notice</span>
            </h2>
          </div>
          <div className="mt-12 font-grotesk">
            <p className="text-lg text-gray-600">
              <strong>Effective Date:</strong> 28 – Oct - 2025
            </p>
            <p className="text-lg text-gray-600">
              <strong>Last Updated:</strong> Welcome to Cabnex, a brand owned and operated by Nexfleet Tech Solutions Pvt. Ltd.By accessing or using our website www.cabnex.in, you agree to the terms outlined in this Legal Notice. If you do not agree with any part of this notice, please refrain from using the website or associated services.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">1. Company Information</h3>
            <p className="mt-4 text-lg text-gray-600">
              Cabnex is a registered brand of Nexfleet Tech Solutions Pvt. Ltd., engaged in providing corporate, intercity, and leisure travel services across India.
            </p>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li><strong>Registered Entity:</strong> Nexfleet Tech Solutions Pvt. Ltd.</li>
              <li><strong>Website:</strong> www.cabnex.in</li>
              <li><strong>Email:</strong> info@cabnex.in</li>
              <li><strong>Phone:</strong> +91 96672 84400</li>
              <li><strong>Registered Address:</strong> MIQB, C 25, Sector 58, Noida 201301</li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">2. Ownership and Copyright</h3>
            <p className="mt-4 text-lg text-gray-600">
              All content, including but not limited to text, graphics, images, logos, icons, videos, design elements, and software on this website, are the intellectual property of Nexfleet Tech Solutions Pvt. Ltd. unless otherwise stated. Unauthorized reproduction, distribution, modification, or publication of any content from www.cabnex.in is strictly prohibited and may result in legal action under applicable copyright and IT laws of India.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">3. Trademarks</h3>
            <p className="mt-4 text-lg text-gray-600">
              “Cabnex” and its associated logo are registered trademarks of Nexfleet Tech Solutions Pvt. Ltd. Any unauthorized use of these trademarks, trade names, or visual assets is prohibited.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">4. Disclaimer of Liability</h3>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>The information provided on www.cabnex.in is for general informational purposes only.</li>
              <li>While we make every effort to ensure accuracy, we do not guarantee the completeness, reliability, or suitability of any information or images displayed.</li>
              <li>Cabnex shall not be liable for any direct, indirect, incidental, or consequential losses resulting from the use or inability to use our website or services.</li>
              <li>Routes, fares, and vehicle availability are subject to operational and regulatory changes.</li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">5. Third-Party Links</h3>
            <p className="mt-4 text-lg text-gray-600">
              Our website may include links to external sites for user convenience. Cabnex does not endorse or assume responsibility for the content, security, or privacy practices of these third-party websites. Accessing external links is at the user’s discretion.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">6. Service Disclaimer</h3>
            <p className="mt-4 text-lg text-gray-600">
              Cabnex acts as a mobility and transport solutions provider connecting customers with verified drivers and vehicles. While all drivers and vehicles are vetted, Cabnex is not responsible for incidents arising from factors beyond our control, such as:
            </p>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>Traffic delays, road closures, or weather conditions</li>
              <li>Third-party negligence or unforeseen events</li>
              <li>Miscommunication caused by incorrect booking information</li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">7. Legal Jurisdiction</h3>
            <p className="mt-4 text-lg text-gray-600">
              This website and all transactions conducted through it are governed by the laws of India. Any disputes or claims shall be subject to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh, India.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">8. Policy Updates</h3>
            <p className="mt-4 text-lg text-gray-600">
              Cabnex reserves the right to modify or update this Legal Notice at any time without prior notice. The updated version will be posted on this page with a revised effective date. Continued use of our website implies acceptance of such updates.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">9. Contact Information</h3>
            <p className="mt-4 text-lg text-gray-600">
              For any legal inquiries, notices, or claims, please contact:
            </p>
            <address className="mt-4 not-italic text-lg text-gray-600">
              Legal Department<br />
              Nexfleet Tech Solutions Pvt. Ltd. (Cabnex)<br />
              📞 +91 96672 84400<br />
              ✉️ sales@cabnex.in<br />
              🌐 www.cabnex.in<br />
              📍 MIQB, C 25, Sector 58, Noida 201301
            </address>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LegalNoticePage;
