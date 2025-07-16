import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { Zone } from "./pages/Zone";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Features from "./pages/Features";
import How from "./pages/How";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
export const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/zone' element={<Zone />} />
          <Route path='/features' element={<Features />} />
          <Route path='/how' element={<How />} />
          <Route path='/security' element={<Security />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};
