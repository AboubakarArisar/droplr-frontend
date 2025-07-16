import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className='w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center'>
      <div className='flex items-center space-x-2'>
        <span className='inline-block w-8 h-8 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-lg mr-2'></span>
        <span className='text-2xl font-bold text-gray-800 tracking-tight'>
          <Link to='/'>Droplr</Link>
        </span>
      </div>
      <nav className='hidden md:flex space-x-8 text-gray-600 font-medium'>
        <a href='#features' className='hover:text-blue-600 transition'>
          Features
        </a>
        <a href='#how' className='hover:text-blue-600 transition'>
          How it works
        </a>
        <a href='#security' className='hover:text-blue-600 transition'>
          Security
        </a>
      </nav>
    </header>
  );
};
