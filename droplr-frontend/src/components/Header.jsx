import React from "react";
import { useNavigate } from "react-router-dom";
export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className='flex items-center justify-between py-4 px-8 bg-[#1e293b] shadow-lg  '>
      <div className='text-3xl  text-center w-full font-bold text-blue-500 tracking-wide'>
        <span className='cursor-pointer' onClick={() => navigate("/")}>
          PindariDrop
        </span>
      </div>
    </header>
  );
};
