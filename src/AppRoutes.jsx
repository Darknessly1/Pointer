import { Route, Routes } from "react-router-dom";
import Analytics from "./pages/Dashboard/Analytics";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Reporting from "./pages/Dashboard/Reporting";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pages/test" element={<Test />} />
        <Route path="/pages/analytics" element={<Analytics />} />
        <Route path="/pages/reporting" element={<Reporting />} />
    </Routes>
);

export default AppRoutes;
