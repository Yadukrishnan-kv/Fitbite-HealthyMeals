import { useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
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
import { useSetting, useDocumentMeta } from "./context/SiteContext";
import AdminApp from "./admin/AdminApp";

function HomePage() {
  useDocumentMeta({
    title: useSetting("siteTitle", "Fitbite — Chef Crafted Nutrition. Delivered Daily."),
    description: useSetting("metaDescription", ""),
    keywords: useSetting("metaKeywords", ""),
  });

  return (
    <>
      <Hero />
      <TrustBar />
      <About />
      <FeaturedDishes />
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public site chrome (navbar + footer) wraps only the public routes.
function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Admin panel — self-contained, no public chrome. */}
      <Route path="/admin/*" element={<AdminApp />} />

      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dishes" element={<DishesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
