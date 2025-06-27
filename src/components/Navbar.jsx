import React, { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBars } from "react-icons/fa";

function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleClick = () => {
    setHidden(prev => !prev);
  };

  const logoutpro = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className='bg-slate-800 relative'>
      <div className='flex justify-between items-center px-4 sm:px-10 md:px-20 lg:mx-48 py-2 text-white'>
        <div className='text-xl'>
          <strong className='text-green-600'>&lt;</strong>
          <strong>Pass</strong>
          <strong className='text-green-600'>OP/&gt;</strong>
        </div>

        {/* Desktop Button */}
        <div className='hidden sm:flex relative'>
          <button
            className='flex items-center border rounded-full px-3 py-1 bg-green-600 hover:bg-green-700 transition-colors'
            onClick={handleClick}
          >
           <CgProfile size={20}/>
            <span className='ml-2'>profile</span>
          </button>

          {hidden && (
            <div className='absolute right-0 mt-10 w-40 bg-white text-black rounded shadow-lg py-3 z-10 flex flex-col justify-center items-center'>
              <p className='text-sm'>{user.username}</p>
              <p className='text-xs break-all text-center'>{user.email}</p>
              <button
                className='w-20 mt-3 hover:bg-gray-400 border border-gray-200 rounded-md py-1 text-sm'
                onClick={logoutpro}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className='sm:hidden'>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className='sm:hidden bg-white text-black py-4 px-6'>
          <p className='text-sm'>{user.username}</p>
          <p className='text-xs break-words'>{user.email}</p>
          <button
            className='w-full mt-3 hover:bg-gray-200 border border-gray-300 rounded-md py-1 text-sm'
            onClick={logoutpro}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
