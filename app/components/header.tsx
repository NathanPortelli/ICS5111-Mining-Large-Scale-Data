import Link from 'next/link';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';

import { auth, db } from './../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between p-4 bg-black text-white border-b border-white">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold mr-6 border-r border-white pr-4" style={{ userSelect: 'none' }}>
            Diet Recommender
        </h1>
        <nav className="flex space-x-4">
          <Link href="/" className='pr-4'> Home </Link>
          <Link href="/" className='pr-4'> History </Link>
          <Link href="/" className='pr-4'> Preferences </Link>
        </nav>
      </div>
      <div className="relative">
        <FaUser className="text-2xl cursor-pointer" onClick={toggleDropdown} />
        {showDropdown && (
          <div className="absolute top-10 right-0 bg-white text-black rounded shadow-md p-2">
            <Link href="/account">
              <div className="flex items-center space-x-2 cursor-pointer">
                <FaCog />
                <span>Account</span>
              </div>
            </Link>
            <Link href="/credentials">
                <div className="flex items-center space-x-2 cursor-pointer">
                    <FaSignOutAlt />
                    <span>Log Out</span>
                </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
