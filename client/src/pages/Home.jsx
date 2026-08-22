import React from "react";

import Hero from "../components/Hero";
import Services from "../components/Services";
import Projects from "../components/Projects";
import BeforeAfter from "../components/BeforeAfter";
import WhyChoose from "../components/WhyChoose";
import Stats from "../components/Stats";
import Team from "../components/Team";
import Testimonials from "../components/Testimonials";

function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Projects />
      <BeforeAfter />
      <WhyChoose />
      <Stats />
      <Team />
      <Testimonials />
    </>
  );
}

export default Home;