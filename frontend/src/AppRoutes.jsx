import { Route, Routes } from "react-router-dom";
import Analytics from "./pages/Dashboard/Analytics";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Reporting from "./pages/Dashboard/Reporting";
import Settings from "./pages/Settings";
import Schedulestable from "./pages/EmpliyeeShcudles/Schedulestable";
import Projects from "./pages/Dashboard/Projects";
// import Chat from "./pages/EmpliyeeShcudles/Chat";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/SignUp";
import { Aboutus } from "./pages/Aboutus";
import Contactus from "./pages/Contactus";
import Teamschedule from "./pages/EmpliyeeShcudles/teamschedule/Teamschedule";
import TeamsDashboard from "./pages/EmpliyeeShcudles/teamschedule/TeamsDashboard";
import Mainmenu from "./pages/EmpliyeeShcudles/teamschedule/Mainmenu";
import DiscussionPage from "./pages/EmpliyeeShcudles/DiscussionPage";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pages/test" element={<Test />} />
        <Route path="/pages/analytics" element={<Analytics />} />
        <Route path="/pages/reporting" element={<Reporting />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/schedulestable" element={<Schedulestable />} />
        <Route path="/projects" element={<Projects />} />
        {/* <Route path="/allemp" element={<Chat />} /> */}
        <Route path="/discussion" element={<DiscussionPage />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/teamschedule" element={<Teamschedule />} />
        <Route path="/teamsDashboard" element={<TeamsDashboard />} />
        <Route path="/mainmenu" element={<Mainmenu />} />
        
    </Routes>
);

export default AppRoutes;
