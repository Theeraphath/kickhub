import { useLocation } from "react-router-dom";

function Test2() {
  const location = useLocation();
  const item = location.state;

  console.log(item);

  return (
    <div>
      <h1>ยินดีต้อนรับ</h1>
      <h1>{item?.data.field_name}</h1>
      <h1>หมายเลข: {item?.data._id}</h1>
      <h1>เวลาเริ่ม: {item?.time.start_datetime}</h1>
      <h1>เวลาสิ้นสุด: {item?.time.end_datetime}</h1>
    </div>
  );
}

export default Test2;
