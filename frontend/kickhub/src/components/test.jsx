import { useNavigate } from "react-router-dom";
import Login from "./Login";
function Test1() {
  const Navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <h1 className="text-4xl font-bold text-black">
        congratulations you are logged in
      </h1>
    </div>
  );
}

export default Test1;
