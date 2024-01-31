"use client";

import { useRouter } from "next/navigation";

import { Snackbar } from "@mui/material";
import { useState } from "react";

import { collection, doc, setDoc } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { db } from "./../firebase";

const Credentials = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const { signIn, signUp } = UserAuth();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSignIn = async () => {
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
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setSnackbarOpen(true);
        return;
      }

      await signUp(name, email, password);

      setError("Registration successful!");
      setSnackbarOpen(true);
      router.push("/");
    } catch (error) {
      setError(error.message);
      setSnackbarOpen(true);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-800">
      <h1 className="mt-8 text-4xl font-semibold text-white mb-8">
        Diet Recommender
      </h1>
      <section className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          {isRegistering ? "Create an Account" : "Sign In"}
        </h2>
        <form className="space-y-4">
          {isRegistering && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600">
                Name:
              </label>
              <input
                type="name"
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              autoComplete="current-password"
              required
            />
          </div>

          {isRegistering && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600">
                Confirm Password:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <button
            type="button"
            onClick={isRegistering ? handleRegister : handleSignIn}
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
