import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { Zone } from "./pages/Zone";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
export const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/zone' element={<Zone />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};
