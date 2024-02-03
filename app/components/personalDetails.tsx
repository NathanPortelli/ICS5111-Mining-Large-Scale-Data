import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "./../firebase";

import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { UserAuth } from "../context/AuthContext";

const PersonalDetails: FC = () => {
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const { handleSubmit, setValue, control } = useForm({
    defaultValues: {
      gender: "",
      age: 0,
      height: 0,
      weight: 0,
      bmi: 0,
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [bmi, setBMI] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { userData, user, fetchUserData } = UserAuth();

  useEffect(() => {
    if (userData) {
      setValue("gender", userData.gender || "");
      setValue("age", userData.age || 0);
      setValue("height", userData.height || 0);
      setValue("weight", userData.weight || 0);
      setBMI(userData.bmi || null);
    }
    setLoading(false);
  }, [userData, setValue]);

  const getWeightStatus = (bmi: number | null) => {
    if (bmi === null) return "";

    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi < 25.0) {
      return "Healthy Weight";
    } else if (bmi >= 25.0 && bmi < 30.0) {
      return "Overweight";
    } else {
      return "Obesity";
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (userData && user) {
        const userDocRef = doc(db, "users", user.uid);

        try {
          // Calculate BMI
          const heightInMeters = data.height / 100;
          const bmiValue = data.weight / (heightInMeters * heightInMeters);

          // Update user details and BMI in FireStore
          await updateDoc(userDocRef, {
            gender: data.gender,
            age: data.age,
            height: data.height,
            weight: data.weight,
            bmi: bmiValue,
          });

          setBMI(bmiValue);

          setError("User details updated successfully");
          setSnackbarOpen(true);
        } catch (error) {
          setError("Error updating user details: " + error.message);
          setSnackbarOpen(true);
        }
      }
      setError("User data updated successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      setError("Error updating user data: " + error.message);
      setSnackbarOpen(true);
    } finally {
      await fetchUserData();
    }
  };

  // Function to apply color based on weight status
  const getWeightStatusColor = (bmi: number | null) => {
    if (bmi === null) return "";
    if (bmi < 18.5) {
      return "text-blue-500";
    } else if (bmi >= 18.5 && bmi < 25.0) {
      return "text-green-500";
    } else if (bmi >= 25.0 && bmi < 30.0) {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  };

  const calculateBMI = (formData: any) => {
    const heightInMeters = formData.height / 100;
    const bmiValue = formData.weight / (heightInMeters * heightInMeters);
    setBMI(bmiValue);
  };

  if (loading) {
    return (
      <div className="flex h-20 flex-col items-center justify-center bg-white rounded-md">
        <CircularProgress />
      </div>
    );
  }

  return (
    <section className="gap-8">
      {/* Personal Details Section */}
      <form className="gap-8 p-6 bg-white rounded-md shadow-md">
        <div className="mb-6">
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Gender is required" }}
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <FormControl className="w-full" error={invalid}>
                <InputLabel id="gender-error-label">Gender</InputLabel>
                <Select
                  labelId="gender-error-label"
                  value={value}
                  onChange={onChange}
                  error={invalid}
                  className="w-full"
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                <FormHelperText>{error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </div>
        <div className="mb-6">
          <Controller
            name="age"
            control={control}
            rules={{
              required: "Age is required",
              validate: (value) => value >= 1 || "Age must be greater or equal to 1",
            }}
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <TextField
                error={invalid}
                type="number"
                label="Age"
                onChange={onChange}
                value={value}
                helperText={error?.message}
                className="w-full"
                InputProps={{ inputProps: { min: 1 } }}
              />
            )}
          />
        </div>

        <div className="mb-6">
          <Controller
            name="height"
            control={control}
            rules={{
              required: "Height is required",
              validate: (value) => value > 40 || "Height must be greater than 40 cm",
            }}
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <TextField
                error={invalid}
                type="number"
                label="Height (cm)"
                onChange={onChange}
                value={value}
                helperText={error?.message}
                className="w-full"
                InputProps={{ inputProps: { min: 40 } }}
              />
            )}
          />
        </div>

        <div className="mb-6">
          <Controller
            name="weight"
            control={control}
            rules={{
              required: "Weight is required",
              validate: (value) => value > 10 || "Weight must be greater than 10 kg",
            }}
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <TextField
                error={invalid}
                type="number"
                label="Weight (kg)"
                onChange={onChange}
                value={value}
                helperText={error?.message}
                className="w-full"
                InputProps={{ inputProps: { min: 10 } }}
              />
            )}
          />
        </div>
        {bmi && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Body Mass Index (BMI)
            </h3>
            <p className="text-2xl text-gray-800">
              {bmi?.toFixed(1)} kg/m<sup>2</sup>
            </p>
            <p
              className={`text-gray-800 font-semibold ${getWeightStatusColor(
                bmi
              )}`}
            >
              {getWeightStatus(bmi)}
            </p>
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => {
              handleSubmit((formData) => {
                onSubmit(formData);
                calculateBMI(formData);
              })();
            }}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-600"
          >
            Save Details
          </button>
        </div>
      </form>
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
export default PersonalDetails;
