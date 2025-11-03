import "./home.css";
import Human from "../../public/human.png";
import Team from "./team.jsx";
import cardfield from "./cardfield.jsx";
function Home() {
  const fielddummy = [
    {
      id: 1,
      name: "Hunter",
      price: 700,
      address: "ไรมง",
       status: "ไม่ว่าง",
    },
      {
      id: 2,
      name: "Eagle",
      price: 700,
      address: "ไรมง",
      status: "ว่าง",
    },
  
   
  ];
  return (
    <div >
      <div>
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
    
      <div>
     
        {fielddummy.map((item) => (
            <Team
              key={item.id}
              image={Image}
              name={item.name}
              price={item.price}
              address={item.address}
              status={item.status}
            />
          ))}
      </div>
      <div>
        
      </div>
    </div>
  );
}

export default Home;
