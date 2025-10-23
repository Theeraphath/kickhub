import "bootstrap-icons/font/bootstrap-icons.css";
import "./home.css";
import Human from "../../public/human.png"
function Home() {
  return (
    <div className="body">
      <div className="headhome">
        <h1>ทีมของคุณ: buddy</h1>
        <h3>นัดถัดไป:</h3>
      </div>
         <div className="girl">
        <img src={Human} alt="Human" />
      </div>
      <div className="homepage">
        <h1>ตี้ประจำ</h1>
      </div>
    </div>
  );
}

export default Home;
