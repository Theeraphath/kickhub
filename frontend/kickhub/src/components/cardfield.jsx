import React from "react";
import "./cardfield.css";
import Image from "../../public/field.jpg";
import { FaMapPin } from "react-icons/fa";

const cardfield = (props) => {
  return (
    
   
      <div className="cardfield">
        <div className="">
        <img className="w-[100px] h-[100px]" src={Image} alt="" />
      </div>
      <div className="flex flex-col gap-2 pl-4">
        <span>
          <h1 className="text-2xl font-bold">{props.name}</h1>
        </span>
        <span className="flex ">
          <FaMapPin />&nbsp;<h2>{props.address}</h2>
        </span>
        <span className="text-green-500">
          <h2>{props.price} bath/hours</h2>
        </span>
      </div>
      <div>
      </div>
      <div>
       <button className="bg-red-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  mt-4">
       <h1>ว่าง</h1>
       </button>
      </div>
      <div>
       <button className="bg-green-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  mt-4 text-center">
       <h1>ดูรายละเอียด</h1>
       </button>
      </div>
      </div>
      
   
  );
};

export default cardfield;
