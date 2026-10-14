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
import ChoirSongs from "@/components/choir/ChoirSongs";
import { News } from "@/components/news/News";
import Gallery from "@/components/gallery/Gallery";
import History from "@/components/history/History";
import Priests from "@/components/priests/Priests";
import Pastoral from "@/components/pastoral/Pastoral";
import PastoralGroupPage from "@/components/pastoral/PastoralGroupPage";
import Places from "@/components/places/Places";
import Contact from "@/components/contact/Contact";

// ============================================================
// BUSCADOR DE CANTOS
// ============================================================

import SongFinder from "@/components/admin/SongFinder";

// ============================================================
// CONTENIDO PRINCIPAL
// ============================================================

function HomeContent() {
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

// ============================================================
// PÁGINA DE INICIO
// ============================================================

function HomePage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, []);

  return <HomeContent />;
}

// ============================================================
// PÁGINAS QUE APUNTAN A UNA SECCIÓN DEL HOME
// ============================================================

function SectionPage({
  sectionId,
}: {
  sectionId: string;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const section =
        document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);

    return () =>
      window.clearTimeout(timer);
  }, [sectionId]);

  return <HomeContent />;
}

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>

          {/* ==================================================
              INICIO
          ================================================== */}

          <Route
            path="/"
            element={<HomePage />}
          />

          {/* ==================================================
              SERVICIOS
          ================================================== */}

          <Route
            path="/services"
            element={
              <SectionPage
                sectionId="servicios"
              />
            }
          />

          {/* ==================================================
              GUÍA DE CONFESIÓN
          ================================================== */}

          <Route
            path="/services/guide-confession"
            element={<ConfessionGuide />}
          />

          {/* ==================================================
              CANTOS DE LA MISA
          ================================================== */}

          <Route
            path="/choir-songs/:serviceHourId"
            element={<ChoirSongs />}
          />

          {/* ==================================================
              NOTICIAS
          ================================================== */}

          <Route
            path="/news"
            element={
              <SectionPage
                sectionId="noticias"
              />
            }
          />

          {/* ==================================================
              GALERÍA
          ================================================== */}

          <Route
            path="/gallery"
            element={
              <SectionPage
                sectionId="galeria"
              />
            }
          />

          {/* ==================================================
              HISTORIA
          ================================================== */}

          <Route
            path="/history"
            element={
              <SectionPage
                sectionId="historia"
              />
            }
          />

          {/* ==================================================
              PÁRROCOS
          ================================================== */}

          <Route
            path="/priests"
            element={
              <SectionPage
                sectionId="parrocos"
              />
            }
          />

          {/* ==================================================
              PASTORAL
          ================================================== */}

          <Route
            path="/pastoral"
            element={
              <SectionPage
                sectionId="pastoral"
              />
            }
          />

          {/* ==================================================
              PÁGINA DE UN GRUPO PRINCIPAL
          ================================================== */}

          <Route
            path="/pastoral/:groupSlug"
            element={
              <PastoralGroupPage />
            }
          />

          {/* ==================================================
              PÁGINA DE UN SUBGRUPO
          ================================================== */}

          <Route
            path="/pastoral/:categorySlug/:groupSlug"
            element={
              <PastoralGroupPage />
            }
          />

          {/* ==================================================
              LUGARES
          ================================================== */}

          <Route
            path="/places"
            element={
              <SectionPage
                sectionId="lugares"
              />
            }
          />

          {/* ==================================================
              CONTACTO
          ================================================== */}

          <Route
            path="/contact"
            element={
              <SectionPage
                sectionId="contacto"
              />
            }
          />

          {/* ==================================================
              BUSCADOR DE CANTOS
              
              Esta ruta NO necesita aparecer en el menú.
              
              Se accede directamente mediante:
              
              /song-finder
              
              Ejemplo:
              
              http://localhost:5173/song-finder
              
              ================================================== */}

          {/* <Route
            path="/song-finder"
            element={<SongFinder />}
          /> */}

        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;