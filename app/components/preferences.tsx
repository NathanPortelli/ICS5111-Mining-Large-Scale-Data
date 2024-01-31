import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import { UserAuth } from "../context/AuthContext";

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

  const { userData } = UserAuth();

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
      if (userData) {
        const userDocRef = doc(db, "users", userData.uid);
        const { prefBreakfast, prefLunch, prefDinner } = userData || {};

        await updateDoc(userDocRef, {
          prefBreakfast: data.prefBreakfast || prefBreakfast,
          prefLunch: data.prefLunch || prefLunch,
          prefDinner: data.prefDinner || prefDinner,
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
    if (userData) {
      const { prefBreakfast, prefLunch, prefDinner } = userData || {};
      setTemporaryPreferences({
        prefBreakfast: prefBreakfast || "",
        prefLunch: prefLunch || "",
        prefDinner: prefDinner || "",
      });
      setSelectedPreferences([prefBreakfast, prefLunch, prefDinner]);
      setShowSelectedPreferences(true);
    }
    setLoading(false);
  }, [userData]);

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <section className="mb-5">
      <div className="bg-white p-8 rounded-md shadow-md">
        <p className="mb-4 font-semibold text-gray-800">
          Choose the category of food you would like to eat for each meal:
        </p>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                  {meal === "Breakfast"
                    ? [
                        <MenuItem key="any" value="any">
                          ❓ Any
                        </MenuItem>,
                        <MenuItem key="eggs" value="eggs">
                          🥚 Eggs
                        </MenuItem>,
                        <MenuItem key="omelette" value="omelette">
                          🍳 Omelette
                        </MenuItem>,
                        <MenuItem key="yogurt" value="yogurt">
                          🥛 Yogurt
                        </MenuItem>,
                        <MenuItem key="oats" value="oats">
                          🥣 Oats
                        </MenuItem>,
                        <MenuItem key="bread" value="bread">
                          🍞 Bread
                        </MenuItem>,
                        <MenuItem key="cereal" value="cereal">
                          🥣 Cereal
                        </MenuItem>,
                        <MenuItem key="fruit" value="fruit">
                          🍎 Fruit
                        </MenuItem>,
                        <MenuItem key="smoothie" value="smoothie">
                          🥤 Smoothie
                        </MenuItem>,
                        <MenuItem key="granola" value="granola">
                          🥜 Granola
                        </MenuItem>,
                      ]
                    : [
                        <MenuItem key="any" value="any">
                          ❓ Any
                        </MenuItem>,
                        <MenuItem key="rice" value="rice">
                          🍚 Rice
                        </MenuItem>,
                        <MenuItem key="pasta" value="pasta">
                          🍝 Pasta
                        </MenuItem>,
                        <MenuItem key="potato" value="potato">
                          🥔 Potatoes
                        </MenuItem>,
                        <MenuItem key="vegetable" value="vegetable">
                          🥦 Vegetables
                        </MenuItem>,
                        <MenuItem key="soup" value="soup">
                          🍲 Soup
                        </MenuItem>,
                        <MenuItem key="wrap" value="wrap">
                          🌯 Wrap
                        </MenuItem>,
                        <MenuItem key="bread" value="bread">
                          🍞 Bread
                        </MenuItem>,
                        <MenuItem key="fish" value="fish">
                          🐟 Fish
                        </MenuItem>,
                        <MenuItem key="pork" value="pork">
                          🐷 Pork
                        </MenuItem>,
                        <MenuItem key="beef" value="beef">
                          🥩 Beef
                        </MenuItem>,
                        <MenuItem key="chicken" value="chicken">
                          🍗 Chicken
                        </MenuItem>,
                      ]}
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
