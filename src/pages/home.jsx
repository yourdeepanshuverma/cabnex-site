import React from "react";
import BannerSection from "../components/homepage/BannerSection";
import Aboutussection from "../components/homepage/aboutus";
import Holidaysection from "../components/homepage/holidays";
// import ActivitySection from "../components/homepage/ActivitySection";
import CarTypesSection from "../components/homepage/cartype";
import HowItWorks from "../components/homepage/howitwork";
import Faqssection from "../components/homepage/faqs";
import FlightForm from "../components/homepage/form";
import WhyChooseUs from "../components/homepage/whychooseus";
import Connectsection from "../components/homepage/connect";
import TestimonialSection from "../components/homepage/testimonial";
import AgentRegistrationSection from "../components/homepage/agent";
import FooterTop from "../components/homepage/footertop";
import Footer from "../components/footer";
import CounterSection from "../components/homepage/counter";

import Header from "../components/header";
import ScrollToTop from "../utils/scroll-to-top";

const Home = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <BannerSection />
      <Aboutussection />
      <Holidaysection />
      {/* <ActivitySection /> */}
      <CarTypesSection />
      <HowItWorks />
      <AgentRegistrationSection />
      <Connectsection />
      <Faqssection />
      <WhyChooseUs />

      <CounterSection />

      <TestimonialSection />
      <FooterTop />
      <Footer />
    </>
  );
};

export default Home;
