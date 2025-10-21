import { useState } from "react";
import Login from "./Login";
function Test1() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <span className="flex flex-col gap-5 items-center">
        <h1 className="text-4xl font-bold text-black">
          This is a test component
        </h1>
        <h1 className="text-4xl font-bold text-black">try to Login</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
      </span>

      {isLogin && <Login modal={true} onClose={() => setIsLogin(false)} />}
    </div>
  );
}

export default Test1;