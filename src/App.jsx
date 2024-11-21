import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./headers/Navbar";
import AppRoutes from "./AppRoutes";

function App() {
    return (
        <Router>
            <div className="flex">
                <Navbar />
                <main className="flex-grow">
                    <AppRoutes />
                </main>
            </div>
        </Router>
    );
}

export default App;
