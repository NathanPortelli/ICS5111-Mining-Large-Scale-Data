"use client";

import { useRouter } from "next/navigation";

import { Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { UserAuth } from "../context/AuthContext";

interface FormValues {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const Credentials = () => {
  const router = useRouter();

  const { reset, handleSubmit, control, getValues } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const { signIn, signUp } = UserAuth();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSignIn = async () => {
    const { email, password } = getValues();
    try {
      await signIn(email, password);
      setError("Sign in successful!");
      setSnackbarOpen(true);
      router.push("/diet");
    } catch (error) {
      setError(error.message);
      setSnackbarOpen(true);
    }
  };

  const handleRegister = async () => {
    const { name, email, password } = getValues();

    try {
      await signUp(name, email, password);

      setError("Registration successful!");
      setSnackbarOpen(true);
      router.push("/");
    } catch (error) {
      setError(error.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    reset();
  }, [isRegistering, reset]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-800">
      <h1 className="mt-8 text-4xl font-semibold text-white mb-8">
        Diet Recommender
      </h1>
      <section className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          {isRegistering ? "Create an Account" : "Sign In"}
        </h2>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(isRegistering ? handleRegister : handleSignIn)}
        >
          {isRegistering && (
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({
                field: { onChange, value },
                fieldState: { invalid, error },
              }) => (
                <TextField
                  error={invalid}
                  type="text"
                  label="Name"
                  onChange={onChange}
                  value={value}
                  helperText={error?.message}
                  className="w-full"
                />
              )}
            />
          )}

          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value is not an email format",
              },
            }}
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <TextField
                error={invalid}
                type="text"
                label="Email"
                onChange={onChange}
                value={value}
                helperText={error?.message}
                className="w-full"
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
            }}
            render={({
              field: { onChange, value },
              fieldState: { invalid, error },
            }) => (
              <TextField
                error={invalid}
                type="password"
                label="Password"
                onChange={onChange}
                value={value}
                helperText={error?.message}
                className="w-full"
              />
            )}
          />

          {isRegistering && (
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Confirm Password is required",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
              }}
              render={({
                field: { onChange, value },
                fieldState: { invalid, error },
              }) => (
                <TextField
                  error={invalid}
                  type="password"
                  label="Confirm Password"
                  onChange={onChange}
                  value={value}
                  helperText={error?.message}
                  className="w-full"
                />
              )}
            />
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-600"
          >
            {isRegistering ? "Register" : "Sign In"}
          </button>

          <p
            className="text-sm text-gray-600 text-center cursor-pointer hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Sign In"
              : "Don't have an account? Register"}
          </p>
        </form>
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

export default Credentials;
