import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import aboutImage from "../assets/about/aboutc.png";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const teamMembers = [
  {
    name: "John Doe",
    designation: "CEO & Founder",
    imageUrl: aboutImage,
    bio: "John is a visionary leader with over 20 years of experience in the transportation industry. He is passionate about creating innovative solutions that make travel easier and more enjoyable for everyone.",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    name: "Jane Smith",
    designation: "COO",
    imageUrl: aboutImage,
    bio: "Jane is a seasoned operations executive with a proven track record of success. She is responsible for overseeing all aspects of our day-to-day operations, from fleet management to customer service.",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    name: "Peter Jones",
    designation: "CTO",
    imageUrl: aboutImage,
    bio: "Peter is a brilliant technologist with a passion for building cutting-edge software. He leads our team of engineers in developing the technology that powers our platform.",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    name: "Mary Williams",
    designation: "CFO",
    imageUrl: aboutImage,
    bio: "Mary is a financial expert with a deep understanding of the transportation industry. She is responsible for managing our finances and ensuring our long-term financial health.",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
];

const OurTeamPage = () => {
  return (
    <>
      <Header />
      <div
        className="bg-cover bg-center py-24"
        style={{
          backgroundImage: "url('src/assets/carlisting/page-header-bg.jpg')",
        }}
      >
        <div className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold font-grotesk text-white sm:text-5xl">
            Our <span className="text-orange-500">Team</span>
          </h2>
          <p className="mt-4 text-xl text-white font-grotesk">
            Driven by Experience, Defined by Excellence
          </p>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xl text-gray-600 font-grotesk">
              At Cabnex, our strength lies not in one person — but in a team
              that shares a single vision: to make ground mobility smarter,
              smoother, and more reliable for businesses and travelers alike.
            </p>
            <p className="mt-4 text-xl text-gray-600 font-grotesk">
              Behind every successful trip, timely transfer, and satisfied
              partner is a team of dedicated professionals — experts from the
              travel, fleet, and technology industries — who work together with
              precision and passion.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-12">
            <div>
              <h3 className="text-3xl font-bold font-grotesk text-gray-900 text-center">
                The People Behind the{" "}
                <span className="text-orange-500">Wheel</span>
              </h3>
              <p className="mt-4 text-lg text-gray-500 font-grotesk text-center">
                Our team is built on collaboration and accountability. From
                operations and logistics to partner management and technology,
                each department is aligned to ensure that Cabnex delivers
                efficiency, transparency, and trust across every route and every
                ride.
              </p>
              <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  <p className="ml-3 text-lg text-gray-700 font-grotesk">
                    <b>Fleet & Operations Team</b> – Ensures every vehicle and
                    chauffeur meets our quality, compliance, and punctuality
                    benchmarks.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  <p className="ml-3 text-lg text-gray-700 font-grotesk">
                    <b>Technology & Systems Team</b> – Develops and maintains
                    the digital infrastructure powering our fleet coordination
                    and partner interface.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  <p className="ml-3 text-lg text-gray-700 font-grotesk">
                    <b>Partner Relations & B2B Support</b> – Works closely with
                    travel agencies, corporate clients, and regional partners
                    for seamless coordination.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  <p className="ml-3 text-lg text-gray-700 font-grotesk">
                    <b>Customer Experience & Safety Team</b> – Focused on
                    communication, client satisfaction, and safety across every
                    booking.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 items-center">
            <div className="grid grid-cols-1 gap-y-10">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold font-grotesk text-gray-900">
                  What Makes Us{" "}
                  <span className="text-orange-500">Different</span>
                </h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <p className="ml-3 text-lg text-gray-700 font-grotesk">
                      <b>Unified Vision</b> – Every team member contributes to
                      the same goal: dependable and professional travel service
                      delivery.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <p className="ml-3 text-lg text-gray-700 font-grotesk">
                      <b>Real-Time Collaboration</b> – Technology-driven
                      coordination ensures timely, accurate communication across
                      departments.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <p className="ml-3 text-lg text-gray-700 font-grotesk">
                      <b>Commitment to Quality</b> – Continuous training and
                      process improvement keep our standards consistently high.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <img
                src={aboutImage}
                alt="What makes us different"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meet our team */}
      {/* <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold font-grotesk text-gray-900 sm:text-5xl">
              Meet Our <span className="text-orange-500">Team</span>
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center bg-white p-8 rounded-lg">
                <img className="mx-auto h-40 w-40 rounded-full" src={member.imageUrl} alt={member.name} />
                <h3 className="mt-6 text-xl font-semibold font-grotesk text-gray-900">{member.name}</h3>
                <p className="text-md text-gray-500 font-grotesk">{member.designation}</p>
                <p className="mt-4 text-sm text-gray-500 font-grotesk">{member.bio}</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <a href={member.social.facebook} className="text-gray-400 hover:text-gray-500">
                    <FaFacebook />
                  </a>
                  <a href={member.social.twitter} className="text-gray-400 hover:text-gray-500">
                    <FaTwitter />
                  </a>
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-gray-500">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold font-grotesk text-gray-900">
            Together, We Move <span className="text-orange-500">Forward</span>
          </h3>
          <p className="mt-4 text-xl text-gray-600 font-grotesk">
            We believe that great journeys start with great people — and our
            team is the engine that keeps Cabnex moving. With the right balance
            of human touch and technological innovation, we’re not just building
            a fleet — we’re building a future for smarter mobility.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OurTeamPage;
