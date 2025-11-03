import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaMapMarkerAlt,
  FaBell,
  FaUser,
  FaFutbol,
} from "react-icons/fa";

const BottomNav = () => {
  const navItems = [
    { name: "หน้าหลัก", icon: <FaHome />, path: "/" },

     { name: "ค้นหาสนาม", icon: <FaMapMarkerAlt />, path: "/search" },
     { name: "หาไปรตี", icon: <FaFutbol />, path: "/team", },

     { name: "ค้นหาสนาม", icon: <FaMapMarkerAlt />, path: "/test" },
     { name: "หาไปรตี", icon: <FaFutbol />, path: "/team" },

    { name: "การแจ้งเตือน", icon: <FaBell />, path: "/notifications" },
    { name: "โปรไฟล์", icon: <FaUser />, path: "/login" },

  ];

  return (
    <nav className="font-noto-thai fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200">
      <ul className="flex justify-around items-center">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs py-2 ${
                  isActive ? "text-green-500 border-t-2 border-green-500" : "text-gray-500"
                }`
              }
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
