import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import TopNavbar from "./headers/TopNavbar";
import "./index.scss"
import Footer from "./headers/Footer";

function App() {
  return (
    <div 
      style={{zIndex: 1}}
    >
      <Router>
        <div className="flex flex-col flex-grow">
          <TopNavbar className="absolute h-18" />
          <main className="flex-grow p-4">
            <AppRoutes />
          </main>
        </div>
        <div className="">
          <Footer />
        </div>
      </Router>

      
    </div>
  );
}

export default App;
