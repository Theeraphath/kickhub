import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";
import BottomNav from "./components/Navbar";
import Login from "./components/Login";
import Test1 from "./components/test";
import Test2 from "./components/test2";
import Home from "./components/home";
import Party from "./components/party";
import Reserve from "./components/reserve";
import Promptpay from "./components/prompypay";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/SignUp";
import FindCreateParty from "./components/FindCreateParty";
import FindandCreate from "./components/FindandCreate";
import Notifications from "./components/Notification";
import Partybuffet from "./components/Partybuffet";
import PartyRole from "./components/Partyrole";

function AppRoutes() {
  const location = useLocation();
  const hideNavPaths = [
    "/login",
    "/SignUp",
    "/reserve",
    "/promptpay",
    "/partybuffet",
    "/partyrole",
    "/historybuffet/:id",
    "/historyrole/:id",
  ];
  const shouldHideNav = hideNavPaths.some((path) =>
    matchPath({ path, end: true }, location.pathname)
  );

  const shouldShowNav = !shouldHideNav;

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/partybuffet" element={<Partybuffet />} />
        <Route path="/partyrole" element={<PartyRole />} />
        <Route path="/team" element={<FindCreateParty />} />
        <Route path="/Findandcreate" element={<FindandCreate />} />
        <Route path="/test/:id" element={<Test2 />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/historybuffet/:id" element={<Partybuffet />} />
        <Route path="/historyrole/:id" element={<PartyRole />} />

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
      {shouldShowNav && <BottomNav />}
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
