"use client";

import { useState } from "react";

import { Snackbar } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PreferenceAllergies from "../components/preferencesAllergies";
import { UserAuth } from "../context/AuthContext";
import PersonalDetails from "./../components/personalDetails";
import Preferences from "./../components/preferences";

const Account = () => {
  const [currentTab, setCurrentTab] = useState("personal");
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { userData } = UserAuth();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <main className="flex flex-col items-center bg-gray-800">
      {userData ? (
        <section className="mt-8 sticky top-0 w-full px-10">
          <div className="flex">
            <button
              className={`flex-1 px-6 pt-3 pb-2 text-center rounded-tl-lg font-semibold ${
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
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <CircularProgress />
        </div>
      )}

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
