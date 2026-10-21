import { Fragment, useEffect } from "react";
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
import { useDocumentMeta, useSite } from "./context/SiteContext";
import AdminApp from "./admin/AdminApp";

// Keys match the Section documents managed in /admin/sections. Order here is
// only the fallback used before the API responds (or if it's unreachable);
// the live homepage order comes from each section's sortOrder in the DB.
const DEFAULT_SECTION_ORDER = [
  "hero",
  "trustbar",
  "about",
  "whyChoose",
  "process",
  "behind",
  "cta",
  "contact",
];

const SECTION_COMPONENTS = {
  hero: Hero,
  trustbar: TrustBar,
  about: About,
  whyChoose: WhyChoose,
  process: Process,
  behind: Behind,
  cta: CTA,
  contact: Contact,
};

// FeaturedDishes/Testimonials/FAQ aren't Section documents (they're their own
// CRUD resources without a position field), so they're anchored to render
// right after a given section and move together with it when reordered.
const SECTION_EXTRAS = {
  about: FeaturedDishes,
  behind: Testimonials,
  cta: FAQ,
};

function HomePage() {
  useDocumentMeta({
    title: "Fitbite — Chef Crafted Nutrition. Delivered Daily.",
    description:
      "Fitbite delivers chef-crafted, nutritionist-approved healthy meals daily in Kozhikode, Kerala. High-protein power bowls and salads to fuel your performance.",
    keywords: "healthy meals, meal delivery, high protein, Kozhikode, Kerala, salads, power bowls, fitness food",
  });

  const { sections } = useSite();
  const order = sections.length ? sections.map((s) => s.key) : DEFAULT_SECTION_ORDER;

  return (
    <>
      {order.map((key) => {
        const Section = SECTION_COMPONENTS[key];
        if (!Section) return null;
        const Extra = SECTION_EXTRAS[key];
        return (
          <Fragment key={key}>
            <Section />
            {Extra && <Extra />}
          </Fragment>
        );
      })}
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
