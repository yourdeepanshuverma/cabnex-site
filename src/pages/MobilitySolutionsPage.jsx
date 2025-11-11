import React from "react";
import Header from "../components/header";
import Footer from "../components/footer"; // Assuming you have a footer
import {
  BriefcaseIcon,
  CameraIcon,
  CalendarIcon,
  UsersIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import aboutImage from "../assets/about/aboutc.png";
import ScrollToTop from "../utils/scroll-to-top";

const services = [
  {
    id: "leisure",
    title: "Leisure & Holiday Travel",
    tagline: "Discover South India at your own pace.",
    icon: GlobeAltIcon,
    description:
      "Cabnex specializes in curated leisure and holiday travel experiences across Kerala, Tamil Nadu, Karnataka, and beyond. Our modern fleet — from sedans to luxury tempo travellers and premium coaches — is perfect for family holidays, honeymoon trips, group getaways, or long-distance tours.",
    longDescription:
      "From Munnar’s misty hills to Alleppey’s backwaters, or temple trails in Madurai and the cultural charm of Mysore — enjoy stress-free travel with our trained chauffeurs and flexible itineraries.",
    highlights: [
      "Customizable tour plans",
      "Air-conditioned vehicles with comfortable seating",
      "Experienced local drivers",
      "24×7 on-trip assistance",
      "Options for multi-day intercity journeys",
    ],
    image: aboutImage,
  },
  {
    id: "corporate",
    title: "Corporate Travel",
    tagline:
      "Dependable, professional, and punctual — mobility designed for business.",
    icon: BriefcaseIcon,
    description:
      "Cabnex offers dedicated corporate travel solutions for companies, executives, and business travelers. We understand the importance of timeliness, comfort, and discretion in business mobility.",
    longDescription:
      "From airport transfers to full-day rentals and intercity meetings, our fleet is maintained to the highest standards with uniformed chauffeurs ensuring a smooth experience.",
    idealFor: [
      "Employee transport & office commutes",
      "Executive & VIP transfers",
      "Business meetings and site visits",
      "Corporate tie-ups and retainers",
    ],
    image: aboutImage,
  },
  {
    id: "events",
    title: "Events & Delegations",
    tagline: "On-ground logistics made effortless.",
    icon: UsersIcon,
    description:
      "Whether it’s a wedding, convention, or official delegation, Cabnex handles event transport with precision and professionalism. Our operations team coordinates multi-vehicle assignments, manages on-site support, and ensures every guest arrives on time and in comfort.",
    weCover: [
      "Destination weddings and family gatherings",
      "Government or corporate delegations",
      "Product launches and conventions",
      "Event-based shuttle operations",
    ],
    keyFeatures: [
      "Fleet coordination and scheduling",
      "On-ground supervision and driver management",
      "Branding and hospitality support upon request",
    ],
    image: aboutImage,
  },
  {
    id: "sightseeing",
    title: "City & Sightseeing Tours",
    tagline: "Comfortable city exploration for travelers and guests.",
    icon: CameraIcon,
    description:
      "Make the most of your day with our curated city and sightseeing tours. Whether it’s a day trip in Kochi, a cultural circuit in Madurai, or a scenic drive through Wayanad, our vehicles and chauffeurs are ready to make it memorable.",
    servicesInclude: [
      "Full-day and half-day city sightseeing",
      "Airport to city exploration for transit guests",
      "Pre-designed tourist circuits and custom itineraries",
      "Clean vehicles, knowledgeable drivers, and flexible scheduling",
    ],
    image: aboutImage,
  },
  {
    id: "mice",
    title: "MICE Transport",
    tagline:
      "Smart transport for Meetings, Incentives, Conferences, and Exhibitions.",
    icon: CalendarIcon,
    description:
      "Cabnex provides customized mobility solutions for large-scale business events. We collaborate with event organizers, corporates, and DMCs to ensure smooth, coordinated logistics for delegates, speakers, and guests.",
    servicesInclude: [
      "Fleet allocation and movement planning",
      "Airport-hotel-venue shuttle operations",
      "VIP and executive-level arrangements",
      "Branding and coordination support for MICE events",
    ],
    whyChoose: [
      "Centralized coordination",
      "Trained, multilingual chauffeurs",
      "Real-time monitoring and communication",
      "Pan-South India operational coverage",
    ],
    image: aboutImage,
  },
];

const MobilitySolutionsPage = () => {
  return (
    <div className="bg-white">
      <ScrollToTop />
      <Header />

      {/* Page Header */}
      <div className="bg-gray-100 pt-36 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-grotesk text-gray-900 tracking-tight">
            Mobility <span className="text-orange-500">Solutions</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-grotesk">
            Comprehensive transport services for every need, from leisure
            holidays to corporate events.
          </p>
        </div>
      </div>

      {/* Services Sections */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-20">
          {services.map((service, index) => (
            <section
              key={service.id}
              id={service.id}
              className={`scroll-mt-20 flex flex-col md:flex-row items-center gap-8 lg:gap-16 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <service.icon className="h-10 w-10 text-orange-500" />
                  <h2 className="text-3xl font-bold font-grotesk text-gray-800">
                    {service.title}
                  </h2>
                </div>
                <p className="text-lg font-semibold font-grotesk text-gray-600 mb-4">
                  {service.tagline}
                </p>
                <p className="text-gray-700 mb-4 font-grotesk">
                  {service.description}
                </p>
                {service.longDescription && (
                  <p className="text-gray-700 mb-4 font-grotesk">
                    {service.longDescription}
                  </p>
                )}

                {service.highlights && (
                  <div className="mt-6">
                    <h4 className="font-bold font-grotesk text-gray-800 mb-2">
                      Highlights:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 font-grotesk">
                      {service.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {service.idealFor && (
                  <div className="mt-6">
                    <h4 className="font-bold font-grotesk text-gray-800 mb-2">
                      Ideal For:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 font-grotesk">
                      {service.idealFor.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {service.weCover && (
                  <div className="mt-6">
                    <h4 className="font-bold font-grotesk text-gray-800 mb-2">
                      We Cover:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 font-grotesk">
                      {service.weCover.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {service.keyFeatures && (
                  <div className="mt-6">
                    <h4 className="font-bold font-grotesk text-gray-800 mb-2">
                      Key Features:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 font-grotesk">
                      {service.keyFeatures.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {service.servicesInclude && (
                  <div className="mt-6">
                    <h4 className="font-bold font-grotesk text-gray-800 mb-2">
                      Our Services Include:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 font-grotesk">
                      {service.servicesInclude.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {service.whyChoose && (
                  <div className="mt-6">
                    <h4 className="font-bold font-grotesk text-gray-800 mb-2">
                      Why Choose Cabnex for MICE:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 font-grotesk">
                      {service.whyChoose.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="md:w-1/2">
                <img
                  src={service.image}
                  alt={service.title}
                  className="rounded-2xl"
                />
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MobilitySolutionsPage;
