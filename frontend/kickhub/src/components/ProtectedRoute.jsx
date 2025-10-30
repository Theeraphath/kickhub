import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // ✅ รายชื่อ path ที่ไม่ต้องตรวจ token
  const publicPaths = ["/Login", "/SignUp"];

  // 🛡️ ถ้าไม่มี token และ path ไม่อยู่ใน publicPaths → redirect ไป /Login
  if (!token && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  // 🧭 ถ้ามี token อยู่แล้ว และผู้ใช้พยายามเข้า /Login หรือ /SignUp → redirect ไปหน้าแรก
  if (token && publicPaths.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
