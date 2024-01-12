import Link from 'next/link';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import { auth, db } from './../firebase';
import { doc, getDoc } from 'firebase/firestore';

import { useRouter, usePathname } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const uid = auth.currentUser?.uid;
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState('');

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (uid) {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setName(userData.name || '');
        }
      }
    };
    fetchUserData();
  }, [uid]);

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between p-4 bg-black text-white border-b border-white">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold mr-6 border-r border-white pr-4" style={{ userSelect: 'none' }}>
          Diet Recommender
        </h1>
        <nav className="flex space-x-4">
          <Link href="/" className={`pr-4 ${pathname === '/' ? 'text-blue-400' : ''}`}> Home </Link>
          <Link href="/diet" className={`pr-4 ${pathname === '/diet' ? 'text-blue-400' : ''}`}> Diet </Link>
          <Link href="/" className={`pr-4 ${pathname === '/food' ? 'text-blue-400' : ''}`}> Food </Link>
          <Link href="/history" className={`pr-4 ${pathname === '/history' ? 'text-blue-400' : ''}`}> History </Link>
        </nav>  
      </div>
      <div className="relative">
        <div className="relative cursor-pointer" onClick={toggleDropdown}>
          <div className="flex items-center space-x-2 cursor-pointer">
            <p className='font-semibold mr-2'>{name}</p>
            <FaUser className="text-2xl" />
          </div>
        </div>
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