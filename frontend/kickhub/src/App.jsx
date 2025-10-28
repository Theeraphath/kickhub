import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Test1 from "./components/test";
import Home from "./components/home";
import Party from "./components/party";
import Reserve from "./components/reserve";
import Promptpay from "./components/prompypay";

function App() {
  return (
    <Router>
      {/* Simple navigation bar กด comments ถ้าจะแต่ง css เพิ่ม */}
      {/* <div className="p-4 bg-gray-200 flex items-center justify-center">
        <nav className="space-x-4 text-lg font-semibold text-gray-700">
          <Link to="/">Home</Link>
          <Link to="/reserve">Reserve</Link>
          <Link to="/prompypay">Promptpay</Link>
        </nav>
      </div> */}
      <Routes>
        <Route path="/" element={<Test1 />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/Login" element={<Login />} />
        <Route path="prompypay" element={<Promptpay />} />
      </Routes>
    </Router>
  );
}

export default App;
