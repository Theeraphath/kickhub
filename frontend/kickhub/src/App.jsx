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
import OAuthSuccess from "./components/OAuthSuccess";
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
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signUp"
          element={
            <ProtectedRoute>
              <SignUp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partybuffet/:id"
          element={
            <ProtectedRoute>
              <Partybuffet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partyrole/:id"
          element={
            <ProtectedRoute>
              <PartyRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/FindCreateParty"
          element={
            <ProtectedRoute>
              <FindCreateParty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/findandcreate/:fieldId"
          element={
            <ProtectedRoute>
              <FindandCreate />
            </ProtectedRoute>
          }
        />
        <Route path="/test/:id" element={<Test2 />} />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historybuffet/:id"
          element={
            <ProtectedRoute>
              <Partybuffet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historyrole/:id"
          element={
            <ProtectedRoute>
              <PartyRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-party/:fieldId"
          element={
            <ProtectedRoute>
              <CreateParty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-party2/:fieldId"
          element={
            <ProtectedRoute>
              <CreateParty2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/field"
          element={
            <ProtectedRoute>
              <Field />
            </ProtectedRoute>
          }
        />
        <Route
          path="/countdown"
          element={
            <ProtectedRoute>
              <CountdownTimer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner"
          element={
            <ProtectedRoute>
              <Owner />
            </ProtectedRoute>
          }
        />
        <Route path="/test" element={<Test1 />} />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit/:id"
          element={
            <ProtectedRoute>
              <Profile2 />
            </ProtectedRoute>
          }
        />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

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
