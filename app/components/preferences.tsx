import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";

interface FormValues {
  prefBreakfast: string;
  prefLunch: string;
  prefDinner: string;
}

const Preferences: FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [temporaryPreferences, setTemporaryPreferences] = useState<FormValues>({
    prefBreakfast: "",
    prefLunch: "",
    prefDinner: "",
  });
  const [showSelectedPreferences, setShowSelectedPreferences] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePreferenceChange = (meal: string, value: string) => {
    setTemporaryPreferences((prevTemporaryPreferences) => ({
      ...prevTemporaryPreferences,
      [meal]: value,
    }));
  };

  const handleChangePreferences: SubmitHandler<FormValues> = async (data) => {
    try {
      const uid = auth.currentUser?.uid;

      if (uid) {
        const userDocRef = doc(db, "users", uid);

        await updateDoc(userDocRef, {
          prefBreakfast: data.prefBreakfast,
          prefLunch: data.prefLunch,
          prefDinner: data.prefDinner,
        });

        setSelectedPreferences(Object.values(data));
        setShowSelectedPreferences(true);

        setError("User preferences updated.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setError("Error updating preferences: " + error.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const uid = auth.currentUser?.uid;

        if (uid) {
          const userDocRef = doc(db, "users", uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const { prefBreakfast, prefLunch, prefDinner } = userData || {};

            setTemporaryPreferences({
              prefBreakfast: prefBreakfast || "",
              prefLunch: prefLunch || "",
              prefDinner: prefDinner || "",
            });
            setSelectedPreferences([prefBreakfast, prefLunch, prefDinner]);
            setShowSelectedPreferences(true);
          }
        }
      } catch (error) {
        setError("Error fetching user preferences: " + error.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, []);

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <section className="mb-8">
      {/* Food Preferences Section */}
      <div className="bg-white p-8 rounded-md shadow-md">
        <p className="mb-4 font-semibold text-gray-800">
          Please select the type of food you want to eat:
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {["Breakfast", "Lunch", "Dinner"].map((meal, index) => (
            <div key={index}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{meal}</InputLabel>
                <Select
                  {...register(`pref${meal}` as keyof FormValues)}
                  value={temporaryPreferences[`pref${meal}`]}
                  onChange={(e) =>
                    handlePreferenceChange(
                      `pref${meal}`,
                      e.target.value as string
                    )
                  }
                  defaultValue={"any"}
                  label={meal}
                >
                  {meal === "Breakfast" ? (
                    [
                      <MenuItem key="any" value="any">
                        ❓ Any
                      </MenuItem>,
                      <MenuItem key="eggs" value="eggs">
                        🥚 Eggs
                      </MenuItem>,
                      <MenuItem key="yogurt" value="yogurt">
                        🥛 Yogurt
                      </MenuItem>,
                      <MenuItem key="oats" value="oats">
                        🥣 Oats
                      </MenuItem>,
                    ]
                  ) : (
                    [
                      <MenuItem key="any" value="any">
                        ❓ Any
                      </MenuItem>,
                      <MenuItem key="rice" value="rice">
                        🍚 Rice
                      </MenuItem>,
                      <MenuItem key="beef" value="beef">
                        🥩 Beef
                      </MenuItem>,
                      <MenuItem key="chicken" value="chicken">
                        🍗 Chicken
                      </MenuItem>,
                    ]
                  )}
                </Select>
              </FormControl>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <button
            type="button"
            onClick={handleSubmit(handleChangePreferences)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-600"
          >
            Change Preferences
          </button>
        </div>
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

export default Preferences;
