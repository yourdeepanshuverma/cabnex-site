import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';
import aboutImage from '../assets/about/about.jpg';
import whyChooseImage from '../assets/about/aboutc.png';
import { ShieldCheckIcon, LightBulbIcon, HeartIcon, UsersIcon } from '@heroicons/react/24/outline';

const AboutUsPage = () => {
  const features = [
    {
      name: 'Safety First',
      description: 'Your safety is our priority. All our vehicles undergo rigorous checks, and our drivers are trained professionals.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Innovative Technology',
      description: 'We leverage cutting-edge technology for seamless booking, real-time tracking, and efficient communication.',
      icon: LightBulbIcon,
    },
    {
      name: 'Customer-Centric Approach',
      description: 'We are committed to providing exceptional service and a personalized experience for every journey.',
      icon: HeartIcon,
    },
  ];

  return (
    <div className="bg-white">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gray-800 pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0">
          <img className="h-full w-full object-cover" src={aboutImage} alt="About Cabnex" />
          <div className="absolute inset-0 bg-gray-800 mix-blend-multiply" aria-hidden="true" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Building the Future of Mobility</h1>
          <p className="mt-6 text-xl text-indigo-100">
            With the right balance of human touch and technological innovation, we’re not just building a fleet — we’re building a future for smarter mobility.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Our Story</h2>
              <p className="mt-4 text-lg text-gray-600">
                Founded with a vision to revolutionize travel, Cabnex started as a small venture with a big dream: to make transportation reliable, accessible, and safe for everyone. We saw the gaps in the existing services and were driven to fill them with professionalism and a personal touch.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                From a handful of cars to a comprehensive fleet serving multiple cities across South India, our journey has been one of passion and perseverance. We are proud to have become a trusted partner for thousands of travelers, from families on vacation to corporate clients with demanding schedules.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={whyChooseImage} alt="Our Journey" className="w-full  object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Cabnex?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              We are more than just a cab service. We are your trusted partner in mobility.
            </p>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white mx-auto">
                  <feature.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <UsersIcon className="h-16 w-16 text-orange-500 mx-auto"/>
          <h2 className="text-3xl font-extrabold text-gray-900">Meet the People Behind the Wheel</h2>
          <p className="mt-4 text-lg text-gray-600">
            Our strength lies in our team of dedicated professionals, from our expert drivers to our customer support staff. They work tirelessly to make your journey seamless.
          </p>
          <div className="mt-8">
            <Link
              to="/our-team"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-orange-500 hover:bg-black"
            >
              Meet Our Team
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
