import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BottomNav from "./components/Navbar";
import Login from "./components/Login";
import Test1 from "./components/test";
import Home from "./components/home";
import Party from "./components/party";
import Reserve from "./components/reserve";
import Promptpay from "./components/prompypay";
import CreateParty from "./components/CreateParty";
import SearchParty from "./components/SearchParty";
import FindCreateParty from "./components/FindCreateParty";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Test1 />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/prompypay" element={<Promptpay />} /> */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/team" element={< CreateParty/>} />
        <Route path="/team/search" element={< SearchParty/>} /> */}
        <Route path="/team" element={<FindCreateParty />} />

      </Routes>
      <BottomNav />
    </Router>
  );
}

export default App;
