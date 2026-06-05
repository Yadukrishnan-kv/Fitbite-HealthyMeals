import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import About from "./components/About";
import FeaturedDishes from "./components/FeaturedDishes";
import WhyChoose from "./components/WhyChoose";
import Process from "./components/Process";
import Behind from "./components/Behind";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import DishesPage from "./pages/DishesPage";

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <About />
      <FeaturedDishes limit={5} />
      <WhyChoose />
      <Process />
      <Behind />
      <Testimonials />
      <FAQ />
      <CTA />
      <Contact />
    </>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dishes" element={<DishesPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
