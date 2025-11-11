import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useWebsiteSettings } from '../../context/WebsiteSettingsContext';

const FAQ = () => {
  const { settings } = useWebsiteSettings();
  const [openIndex, setOpenIndex] = useState(null);

  const staticFaqs = [
    {
      question: 'How do I register as a Cabnex Agent?',
      answer:
        'Simply click “Join as an Agent”, fill out your business details, upload basic KYC documents, and activate your account. Once approved, you can start booking vehicles instantly.',
    },
    {
      question: 'What types of vehicles are available on Cabnex?',
      answer:
        'We offer a wide range of vehicles — from Sedans, SUVs, and Innovas to Tempo Travellers, Mini Coaches, and Luxury Buses — suitable for local, outstation, and holiday package itineraries across India.',
    },
    {
      question: 'How does the pricing and commission model work?',
      answer:
        'You’ll receive exclusive B2B rates for every booking. Commissions are calculated based on the total fare and credited as per your agent agreement.',
    },
    {
      question: 'Can I make bookings for my clients under my brand name?',
      answer:
        'Yes. You can book on behalf of your clients, and all communication and invoices can carry your agency’s details — ensuring a white-label experience for your customers.',
    },
    {
      question: 'Can I modify or cancel a confirmed booking?',
      answer:
        'Yes, bookings can be modified or cancelled offline currently by contacting the support team through email only before the travel date.',
    },
    {
      question: 'Do you provide airport transfers and intercity trips?',
      answer:
        'Absolutely. Cabnex supports airport transfers, city rentals, and long-distance outstation travel across multiple cities Pan India.',
    },
    {
      question: 'What happens if the assigned vehicle or driver changes?',
      answer:
        'In rare cases, if a vendor updates the vehicle or driver, you’ll receive an instant notification through SMS & email to ensure transparency.',
    },
    {
      question: 'What support do I get as a registered agent?',
      answer:
        'Our dedicated B2B support team is available 24/7 to assist with booking issues, fare clarifications, or operational queries — ensuring a smooth experience for you and your clients.',
    },
    {
      question: 'Is Cabnex available across India?',
      answer:
        'Yes. We operate Pan India with our own inventory and verified vendor partners in major cities, hill stations, and popular tourist destinations.',
    },
  ];

  const faqs = settings?.faqs && settings.faqs.length > 0 ? settings.faqs : staticFaqs;


  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 pb-7 bg-white relative overflow-hidden">
      <div className="relative max-w-7xl text-center mx-auto px-4 sm:px-6 lg:px-8">
        <div className="linrr"></div>
        <span className="text-sm uppercase text-center font-grotesk text-orange-500 tracking-widest">
          FAQ
        </span>

        <h2 className="text-3xl md:text-5xl font-grotesk text-black font-extrabold text-center mb-12">
          Frequently Asked <span className="text-orange-500">Questions</span>
        </h2>

      <div className="flex flex-wrap gap-6">
  {faqs.map((faq, index) => (
    <div
      key={index}
      className={`w-full md:w-[48%] mx-auto p-4 rounded-lg transition-colors duration-300 ${
        openIndex === index ? 'bg-orange-100' : 'bg-[#f2f2f2]'
      } hover:bg-orange-200 cursor-pointer`}
      onClick={() => toggleFAQ(index)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-md md:text-lg font-grotesk font-semibold text-black">
          {faq.question}
        </h3>
        <div
          className={`transition-transform duration-300 ${
            openIndex === index ? 'rotate-180' : ''
          }`}
        >
          <FaChevronDown
            className={`w-5 h-5 ${
              openIndex === index ? 'text-orange-600' : 'text-orange-400'
            }`}
          />
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-700 text-start font-grotesk text-sm pt-2">
          {faq.answer}
        </p>
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
};

export default FAQ;
