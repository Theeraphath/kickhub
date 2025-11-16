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
import Reserve from "./components/reserve";
import Promptpay from "./components/prompypay";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/SignUp";
import FindCreateParty from "./components/FindCreateParty";
import FindandCreate from "./components/FindandCreate";
import Notifications from "./components/Notification";
import Partybuffet from "./components/Partybuffet";
import PartyRole from "./components/Partyrole";
import CreateParty from "./components/CreateParty";
import CreateParty2 from "./components/CreateParty2";
import Field from "./components/field";
import CountdownTimer from "./components/CountdownTimer";
import Owner from "./components/OwnerFieldManager";
import Profile from "./components/profile";
import Profile2 from "./components/profile2";
import ApproveReservaion from "./components/ApproveReservation";

function AppRoutes() {
  const location = useLocation();
  const hideNavPaths = [
    "/login",
    "/SignUp",
    "/reserve/:id",
    "/promptpay/:id",
    "/partybuffet/:id",
    "/partyrole/:id",
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
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/partybuffet/:id" element={<Partybuffet />} />
        <Route path="/partyrole/:id" element={<PartyRole />} />
        <Route path="/FindCreateParty" element={<FindCreateParty />} />
        <Route path="/findandcreate/:fieldId" element={<FindandCreate />} />
        <Route path="/test/:id" element={<Test2 />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/historybuffet/:id" element={<Partybuffet />} />
        <Route path="/historyrole/:id" element={<PartyRole />} />
        <Route path="/create-party/:fieldId" element={<CreateParty />} />
        <Route path="/create-party2/:fieldId" element={<CreateParty2 />} />
        <Route path="/field" element={<Field />} />
        <Route path="/countdown" element={<CountdownTimer />} />
        <Route path="/owner" element={<Owner />} />
        <Route path="/test" element={<Test1 />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/edit/:id" element={<Profile2 />} />
        <Route
          path="/ApproveReservation"
          element={
            <ProtectedRoute>
              <ApproveReservaion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reserve/:id"
          element={
            <ProtectedRoute>
              <Reserve />
            </ProtectedRoute>
          }
        />
        <Route
          path="/promptpay/:id"
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
