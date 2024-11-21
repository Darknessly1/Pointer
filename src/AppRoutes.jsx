import { Route, Routes } from "react-router-dom";
import Analytics from "./pages/Dashboard/Analytics";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Reporting from "./pages/Dashboard/Reporting";
import Settings from "./pages/Settings";
import Schedulestable from "./pages/EmpliyeeShcudles/Schedulestable";
import Projects from "./pages/Dashboard/Projects";
import Allemp from "./pages/EmpliyeeShcudles/Allemp";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pages/test" element={<Test />} />
        <Route path="/pages/analytics" element={<Analytics />} />
        <Route path="/pages/reporting" element={<Reporting />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/schedulestable" element={<Schedulestable />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/allemp" element={<Allemp />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/profile" element={<Profile />} />
    </Routes>
);

export default AppRoutes;
