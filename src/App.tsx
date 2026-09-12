import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";
import { Hero } from "@/components/home/Hero";
import Services from "@/components/services/Services";
import ConfessionGuide from "@/components/services/ConfessionGuide";

function HomePage() {
  return <Hero />;
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
            element={<Services />}
          />

          <Route
            path="/services/guide-confession"
            element={<ConfessionGuide />}
          />

        </Routes>

      </MainLayout>
    </BrowserRouter>
  );
}

export default App;