import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Management from "./pages/Management";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import WalletProvider from "./contexts/WalletProvider";

function App() {
  return (
    <WalletProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/management" element={<Management />} />
      </Routes>
    </WalletProvider>
  );
}

export default App;
