import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./headers/Navbar";
import AppRoutes from "./AppRoutes";
import TopNavbar from "./headers/TopNavbar";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Navbar className="w-64 right-10" />
        <div className="flex flex-col flex-grow">
          <TopNavbar className="h-18" />
          <main className="flex-grow overflow-y-auto p-4">
            <AppRoutes />
          </main>
        </div>
      </div>

    </Router>
  );
}

export default App;
