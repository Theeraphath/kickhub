import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BottomNav from "./components/Navbar";
import Login from "./components/Login";
import Test1 from "./components/test";
import Home from "./components/home";
import Party from "./components/party";
import Reserve from "./components/reserve";
import Promptpay from "./components/prompypay";
import CreateParty from "./components/CreateParty";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Test1 />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/prompypay" element={<Promptpay />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/team" element={< CreateParty/>} />
      </Routes>
      <BottomNav />
    </Router>
  );
}

export default App;
