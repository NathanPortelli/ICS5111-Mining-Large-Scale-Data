"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "./../firebase";

import { Snackbar } from "@mui/material";
import PreferenceAllergies from "../components/preferencesAllergies";
import PersonalDetails from "./../components/personalDetails";
import Preferences from "./../components/preferences";
import { UserAuth } from "../context/AuthContext";

const Account = () => {
  const [currentTab, setCurrentTab] = useState("account");
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [name, setName] = useState("");
  const { user, userData } = UserAuth();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUpdateDetails = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);

      try {
        await updateDoc(userDocRef, { name });
        setError("User details updated successfully");
        setSnackbarOpen(true);
      } catch (error) {
        setError("Error updating user details: " + error.message);
        setSnackbarOpen(true);
      }
    }
  };

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
    }
  }, [userData]);

  return (
    <main className="flex flex-col items-center bg-gray-800">
      <section className="mt-8 sticky top-0">
        <div className="flex">
          <button
            className={`flex-1 px-6 pt-3 pb-2 text-center font-semibold rounded-tl-lg ${
              currentTab === "account"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setCurrentTab("account")}
          >
            Account Details
          </button>
          <button
            className={`flex-1 px-6 pt-3 pb-2 text-center font-semibold ${
              currentTab === "personal"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setCurrentTab("personal")}
          >
            Personal Details
          </button>
          <button
            className={`flex-1 px-6 pt-3 pb-2 text-center font-semibold rounded-tr-lg ${
              currentTab === "preferences"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setCurrentTab("preferences")}
          >
            Preferences
          </button>
        </div>

        {currentTab === "account" && (
          <div className="mb-8 bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Account Details
            </h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-2 font-semibold text-gray-800"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleUpdateDetails}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-600"
              >
                Change Details
              </button>
            </form>
          </div>
        )}

        {currentTab === "personal" && (
          <div className="mb-8 bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Personal Details
            </h2>
            <form>
              <PersonalDetails />
            </form>
          </div>
        )}

        {currentTab === "preferences" && (
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Preferences
            </h2>
            <form>
              <Preferences />
              <PreferenceAllergies />
            </form>
          </div>
        )}
      </section>
      {/* Snackbar for displaying errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={error || ""}
      />
    </main>
  );
};

export default Account;
