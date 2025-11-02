import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import BottomNav from "./components/Navbar";
import Login from "./components/Login";
import Test1 from "./components/test";
import Home from "./components/home";
import Party from "./components/party";
import Reserve from "./components/reserve";
import Promptpay from "./components/prompypay";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/SignUp";
import Partybuffet from "./components/Partybuffet";
// <<<<<<< 31findty
// import FindCreateParty from "./components/FindCreateParty";
// import FindandCreate from "./components/FindandCreate";

// =======
// import Test2 from "./components/test2";
// >>>>>>> main

function AppRoutes() {
  const location = useLocation();
  const hideNavPaths = [
    "/login",
    "/SignUp",
    "/reserve",
    "/promptpay",
    "/partybuffet",
  ];
  const shouldShowNav = !hideNavPaths.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/partybuffet" element={<Partybuffet />} />
// <<<<<<< 31findty
//         <Route path="/team" element={<FindCreateParty />} />
//         <Route path="/findandcreate" element={<FindandCreate />} />
// =======
//         <Route path="/test/:id" element={<Test2 />} />
// >>>>>>> main

        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <Test1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/party"
          element={
            <ProtectedRoute>
              <Party />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reserve"
          element={
            <ProtectedRoute>
              <Reserve />
            </ProtectedRoute>
          }
        />
        <Route
          path="/promptpay"
          element={
            <ProtectedRoute>
              <Promptpay />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ProtectedRoute>{shouldShowNav && <BottomNav />}</ProtectedRoute>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
