import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import { CircularProgress, Snackbar } from "@mui/material";
import { UserAuth } from "../context/AuthContext";

const PreferenceAllegries: FC = () => {
  const { register } = useForm();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [temporaryPreferences, setTemporaryPreferences] = useState<string[]>(
    []
  );
  const [showSelectedPreferences, setShowSelectedPreferences] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { userData, user } = UserAuth();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePreferenceChange = (preference: string) => {
    setTemporaryPreferences((prevTemporaryPreferences) => {
      if (prevTemporaryPreferences.includes(preference)) {
        return prevTemporaryPreferences.filter((pref) => pref !== preference);
      } else {
        return [...prevTemporaryPreferences, preference];
      }
    });
  };

  const handleChangePreferences = async () => {
    try {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        await updateDoc(userDocRef, {
          preferences: temporaryPreferences,
        });

        setSelectedPreferences(temporaryPreferences);
        setShowSelectedPreferences(true);

        setError("User preferences updated.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setError("Error updating preferences:" + error.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const userPreferences = userData?.preferences || [];

    setSelectedPreferences(userPreferences);
    setTemporaryPreferences(userPreferences);
    setShowSelectedPreferences(true);
    setLoading(false);
  }, [userData]);

  if (loading) {
    return (
      <div className="flex h-20 flex-col items-center justify-center bg-white rounded-md">
        <CircularProgress />
      </div>
    );
  }

  return (
    <section>
      <div className="bg-white p-6 rounded-md shadow-md">
        <p className="mb-4 font-semibold text-gray-800">
          Please select your allergies/dietary restrictions:
        </p>
        <div className="grid grid-cols-2 gap-4 text-gray-800">
          {[
            "Dairy Free",
            "Gluten Free",
            "Halal",
            "Kosher",
            "Nut Free",
            "Shellfish Free",
            "Vegetarian",
            "Vegan",
          ].map((preference) => (
            <label key={preference} className="flex items-center">
              <input
                type="checkbox"
                {...register(preference)}
                className="mr-2 border-gray-400 focus:outline-none focus:border-blue-500"
                onChange={() => handlePreferenceChange(preference)}
                checked={temporaryPreferences.includes(preference)}
              />
              {preference}
            </label>
          ))}
        </div>
        {showSelectedPreferences && (
          <p className="mt-4 text-gray-800">
            <b>Selected:</b>
            <br /> {selectedPreferences.join(", ")}
          </p>
        )}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleChangePreferences}
            className="w-full px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-500"
          >
            Save Restrictions
          </button>
        </div>
        <p className="text-sm pt-5 font-semibold">
          Please note that this section is not yet functional, and will
          therefore not impact the generated meal plan!
        </p>
      </div>
      {/* Snackbar for displaying errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={error || ""}
      />
    </section>
  );
};

export default PreferenceAllegries;
