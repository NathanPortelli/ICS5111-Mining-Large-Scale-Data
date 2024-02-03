import { FC, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import {
  CircularProgress,
  FormControl,
  FormHelperText,
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
  const { handleSubmit, control, setValue } = useForm<FormValues>();

  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { userData, user, fetchUserData } = UserAuth();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangePreferences: SubmitHandler<FormValues> = async (data) => {
    try {
      if (userData && user) {
        const userDocRef = doc(db, "users", user.uid);
        const { prefBreakfast, prefLunch, prefDinner } = userData || {};

        await updateDoc(userDocRef, {
          prefBreakfast: data.prefBreakfast || prefBreakfast,
          prefLunch: data.prefLunch || prefLunch,
          prefDinner: data.prefDinner || prefDinner,
        });

        setError("User preferences updated.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      if (!data.prefBreakfast) {
        setError("Error updating preferences: Breakfast Preference not chosen");
      } else if (!data.prefLunch) {
        setError("Error updating preferences: Lunch Preference not chosen");
      } else if (!data.prefDinner) {
        setError("Error updating preferences: Dinner Preference not chosen");
      } else {
        setError("Error updating preferences: " + error.message);
      }
      setSnackbarOpen(true);
    } finally {
      await fetchUserData();
    }
  };

  useEffect(() => {
    if (userData) {
      const { prefBreakfast, prefLunch, prefDinner } = userData || {};
      setValue("prefBreakfast", prefBreakfast || "");
      setValue("prefLunch", prefLunch || "");
      setValue("prefDinner", prefDinner || "");
    }
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
    <section className="mb-5">
      <div className="bg-white p-8 rounded-md shadow-md">
        <p className="mb-4 font-semibold text-gray-800">
          Choose the category of food you would like to eat for each meal:
        </p>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {["Breakfast", "Lunch", "Dinner"].map((meal, index) => (
            <div key={index}>
              <Controller
                key={index}
                name={`pref${meal}` as keyof FormValues}
                control={control}
                rules={{ required: `${meal} is required` }}
                render={({
                  field: { onChange, value },
                  fieldState: { invalid, error },
                }) => (
                  <FormControl fullWidth variant="outlined" error={invalid}>
                    <InputLabel>{meal}</InputLabel>
                    <Select
                      value={value}
                      onChange={onChange}
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
                    <FormHelperText>{error?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <button
            type="button"
            onClick={handleSubmit(handleChangePreferences)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-600"
          >
            Save Preferences
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
