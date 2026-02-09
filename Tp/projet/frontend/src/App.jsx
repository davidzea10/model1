import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PredictionPage from "./pages/PredictionPage";
import HistoryPage from "./pages/HistoryPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="prediction" element={<PredictionPage />} />
        <Route path="historique" element={<HistoryPage />} />
        <Route path="tableau-de-bord" element={<DashboardPage />} />
        <Route path="a-propos" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
