import { useLocation, NavLink } from "react-router-dom";
import {
  FaHome,
  FaMapMarkerAlt,
  FaBell,
  FaUser,
  FaFutbol,
} from "react-icons/fa";
import { GiSoccerField } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";

const BottomNav = () => {
  const location = useLocation();
  const getIdbyToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken._id;
    }
  };
  const getrolebyToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.role;
    }
  };

  const getNavItems = (role) => {
    const id = getIdbyToken();
    if (role === "user") {
      return [
        { name: "หน้าหลัก", icon: <FaHome />, path: "/home" },
        { name: "ค้นหาสนาม", icon: <FaMapMarkerAlt />, path: "/field" },
        { name: "หาปาร์ตี", icon: <FaFutbol />, path: "/FindCreateParty" },
        { name: "การแจ้งเตือน", icon: <FaBell />, path: "/notifications" },
        { name: "โปรไฟล์", icon: <FaUser />, path: `/profile/${id}` },
      ];
    }
    return [
      { name: "จัดการสนาม", icon: <GiSoccerField />, path: "/owner" },
      {
        name: "อนุมัติการจอง",
        icon: <GoChecklist />,
        path: "/ApproveReservation",
      },
      { name: "โปรไฟล์", icon: <FaUser />, path: `/profile/${id}` },
    ];
  };

  const navItems = getNavItems(getrolebyToken());

  return (
    <nav className="font-noto-thai fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200">
      <ul className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={`flex flex-col items-center text-xs py-2 ${
                  isActive
                    ? "text-green-500 border-t-2 border-green-500"
                    : "text-gray-500"
                }`}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <span>{item.name}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
