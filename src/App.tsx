import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";
import { Hero } from "@/components/home/Hero";

function HomePage() {
  return (
    <>
      <Hero />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
