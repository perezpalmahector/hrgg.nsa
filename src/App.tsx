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

function HomePage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <News />
    </>
  );
}

function ServicesPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <>
      <Services />
      <News />
    </>
  );
}

function NewsPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const newsSection = document.getElementById("noticias");

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
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;