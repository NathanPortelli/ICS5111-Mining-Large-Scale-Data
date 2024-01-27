"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";

import { auth } from "./../firebase";

import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../hooks/user";
import { useLocalStorage } from "../hooks/localStorage";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [hideNavBar, setHideNavBar] = useState(false); // Hide the navbar on the credentials page
  const { remove } = useLocalStorage();
  const { uid, user } = useUser();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      remove("userId");
      router.push("/credentials"); // Redirect to the credentials page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    setHideNavBar(!(pathname === "/credentials"));
  }, [pathname]);

  return (
    <>
      {hideNavBar ? (
        <header className="sticky top-0 z-50 w-full flex items-center justify-between p-4 bg-black text-white border-b border-white">
          <div className="flex items-center">
            <h1
              className="text-xl font-semibold mr-6 border-r border-white pr-4"
              style={{ userSelect: "none" }}
            >
              Diet<span className="hidden md:inline"> Recommender</span>
            </h1>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className={`pr-4 ${pathname === "/" ? "text-blue-400" : ""}`}
              >
                {" "}
                Home{" "}
              </Link>
              <Link
                href="/diet"
                className={`pr-4 ${
                  pathname === "/diet" ? "text-blue-400" : ""
                }`}
              >
                {" "}
                Diet{" "}
              </Link>
              <Link
                href="/history"
                className={`pr-4 ${
                  pathname === "/history" ? "text-blue-400" : ""
                }`}
              >
                {" "}
                History{" "}
              </Link>
            </nav>
          </div>
          <div className="relative flex-shrink-0">
            <div className="cursor-pointer" onClick={toggleDropdown}>
              <div className="flex items-center space-x-2 cursor-pointer">
                <p
                  className={`font-semibold mr-2 ${
                    user?.name ? "hidden md:flex" : ""
                  }`}
                >
                  {user?.name}
                </p>
                <FaUser className="text-2xl" />
              </div>
            </div>
            {showDropdown && (
              <div className="absolute top-10 right-0 bg-white text-black rounded shadow-md p-2">
                {uid ? (
                  <>
                    <Link href="/account">
                      <div className="flex items-center space-x-2 cursor-pointer">
                        <FaCog />
                        <span>Account</span>
                      </div>
                    </Link>
                    <Link href="/credentials">
                      <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt />
                        <span>Log Out</span>
                      </div>
                    </Link>
                  </>
                ) : (
                  <Link href="/credentials">
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <FaSignOutAlt />
                      <span>Login</span>
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>
        </header>
      ) : null}
    </>
  );
};

export default Header;
