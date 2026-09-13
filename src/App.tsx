import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";

import { Hero } from "@/components/home/Hero";
import Services from "@/components/services/Services";
import ConfessionGuide from "@/components/services/ConfessionGuide";
import { News } from "@/components/news/News";
import Gallery from "@/components/gallery/Gallery";
import History from "@/components/history/History";
import Priests from "@/components/priests/Priests";
import Pastoral from "@/components/pastoral/Pastoral";
import Places from "@/components/places/Places";
import Contact from "@/components/contact/Contact";

function HomePage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <News />
      <Gallery />
      <History />
      <Priests />
      <Pastoral />
      <Places />
      <Contact />
    </>
  );
}

function ServicesPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, []);

  return (
    <>
      <Services />
      <News />
      <Gallery />
      <History />
      <Priests />
      <Pastoral />
      <Places />
      <Contact />
    </>
  );
}

function NewsPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const newsSection =
        document.getElementById("noticias");

      if (newsSection) {
        newsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <News />
      <Gallery />
      <History />
      <Priests />
      <Pastoral />
      <Places />
      <Contact />
    </>
  );
}

function GalleryPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const gallerySection =
        document.getElementById("galeria");

      if (gallerySection) {
        gallerySection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <News />
      <Gallery />
      <History />
      <Priests />
      <Pastoral />
      <Places />
      <Contact />
    </>
  );
}

function HistoryPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const historySection =
        document.getElementById("historia");

      if (historySection) {
        historySection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <News />
      <Gallery />
      <History />
      <Priests />
      <Pastoral />
      <Places />
      <Contact />
    </>
  );
}

function PriestsPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const priestsSection =
        document.getElementById("parrocos");

      if (priestsSection) {
        priestsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <News />
      <Gallery />
      <History />
      <Priests />
      <Pastoral />
      <Places />
      <Contact />
    </>
  );
}

function PastoralPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const pastoralSection =
        document.getElementById("pastoral");

      if (pastoralSection) {
        pastoralSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <News />
      <Gallery />
      <History />
      <Priests />
      <Pastoral />
      <Places />
      <Contact />
    </>
  );
}

function PlacesPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const placesSection =
        document.getElementById("lugares");

      if (placesSection) {
        placesSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <News />
      <Gallery />
      <History />
      <Priests />
      <Pastoral />
      <Places />
      <Contact />
    </>
  );
}

function ContactPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const contactSection =
        document.getElementById("contacto");

      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <News />
      <Gallery />
      <History />
      <Priests />
      <Pastoral />
      <Places />
      <Contact />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/services"
            element={<ServicesPage />}
          />

          <Route
            path="/services/guide-confession"
            element={<ConfessionGuide />}
          />

          <Route
            path="/news"
            element={<NewsPage />}
          />

          <Route
            path="/gallery"
            element={<GalleryPage />}
          />

          <Route
            path="/history"
            element={<HistoryPage />}
          />

          <Route
            path="/priests"
            element={<PriestsPage />}
          />

          <Route
            path="/pastoral"
            element={<PastoralPage />}
          />

          <Route
            path="/places"
            element={<PlacesPage />}
          />

          <Route
            path="/contact"
            element={<ContactPage />}
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;