"use client";

import {
  Timestamp,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./../firebase";

import { Snackbar } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import Image from "next/image";
import { UserAuth } from "../context/AuthContext";
import { RecipeAPIResponse } from "../interfaces/recipeAPIResponse";
import { GET } from "../utils/api";

interface Meal {
  date: Timestamp;
  uid: string;
  breakfast: string;
  b_calories: number;
  b_instructions: string;
  lunch: string;
  l_calories: number;
  l_instructions: string;
  dinner: string;
  d_calories: number;
  d_instructions: string;
  ingredients: string[];
}

interface GroupMeal {
  breakfast: RecipeAPIResponse | null;
  lunch: RecipeAPIResponse | null;
  dinner: RecipeAPIResponse | null;
}

const MealHistory = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedIngredients, setExpandedIngredients] = useState<{
    [date: string]: { [mealType: string]: boolean };
  }>({});
  const [expandedInstructions, setExpandedInstructions] = useState<{
    [date: string]: { [mealType: string]: boolean };
  }>({});
  const [groupedMeals, setGroupedMeals] = useState<{
    [date: string]: GroupMeal[];
  } | null>(null);

  const { user } = UserAuth();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleIngredients = (dateString, mealType) => {
    setExpandedIngredients((prevExpanded) => ({
      ...prevExpanded,
      [dateString]: {
        ...prevExpanded[dateString],
        [mealType]: !prevExpanded[dateString]?.[mealType] ?? false,
      },
    }));
  };

  const toggleInstructions = (dateString, mealType) => {
    setExpandedInstructions((prevExpanded) => ({
      ...prevExpanded,
      [dateString]: {
        ...prevExpanded[dateString],
        [mealType]: !prevExpanded[dateString]?.[mealType] ?? false,
      },
    }));
  };

  useEffect(() => {
    if (user) {
      fetchData(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (meals.length > 0) {
      getGroupedMeals(meals);
    }
  }, [meals]);

  const getGroupedMeals = async (meals: Meal[]) => {
    setLoading(true);
    await groupMealsByDate(meals)
      .then((data) => {
        setGroupedMeals(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchData = async (uid: string) => {
    try {
      const q = query(
        collection(db, "mealHistory"),
        where("uid", "==", uid),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No history found.");
        return;
      }

      const mealData = querySnapshot.docs.map((doc) => doc.data() as Meal);
      setMeals(mealData);
    } catch (error) {
      setError("Error fetching history: " + error.message);
      console.log("Error fetching history: ", error.message);

      setSnackbarOpen(true);
    }
  };

  const groupMealsByDate = async (meals: Meal[]) => {
    setLoading(true);
    const baseRecipeUrl = "/api/recipe?mealId=";
    const groupedMeals: { [date: string]: GroupMeal[] } = {};

    try {
      await Promise.all(
        meals.map(async (meal) => {
          const dateString = meal.date.toDate().toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

          if (!groupedMeals[dateString]) {
            groupedMeals[dateString] = [];
          }

          const breakfast = await GET(baseRecipeUrl + meal.breakfast).then(
            (res) => res.json()
          );
          const lunch = await GET(baseRecipeUrl + meal.lunch).then((res) =>
            res.json()
          );
          const dinner = await GET(baseRecipeUrl + meal.dinner).then((res) =>
            res.json()
          );

          groupedMeals[dateString].push({
            breakfast,
            lunch,
            dinner,
          });
        })
      );
    } catch (error) {
      console.log("Error fetching recipe: ", error.message);
    } finally {
      setLoading(false);
      return groupedMeals;
    }
  };

  return (
    <main className="flex flex-col bg-gray-800">
      {user && groupedMeals ? (
        <>
          <section className="mt-8 ml-9 mr-9">
            <h1 className="text-4xl font-semibold text-white mb-6">
              Meal History
            </h1>
            {groupedMeals && Object.keys(groupedMeals).length > 0 ? (
              <>
                {Object.keys(groupedMeals).map((dateString, index) => (
                  <div key={index} className="">
                    <h2 className="text-2xl text-white mb-4">{dateString}</h2>
                    <div className="flex flex-wrap justify-between mb-4">
                      {groupedMeals[dateString].map((meal, mealIndex) => (
                        <div key={mealIndex} className="w-full">
                          <div className="flex flex-col lg:flex-row h-full">
                            {["breakfast", "lunch", "dinner"].map(
                              (mealType) => (
                                <div
                                  key={mealType}
                                  className="w-full h-full mb-4 lg:mb-0"
                                >
                                  <div className="flex h-full">
                                    <div
                                      key={mealType}
                                      className="bg-white rounded-md shadow-md mr-6 p-5 flex flex-col justify-between flex-grow"
                                    >
                                      <h3 className="text-xl font-semibold mb-1">
                                        {meal[mealType].title}
                                      </h3>
                                      <div className="bottom-0">
                                        <div className="text-gray-700 mb-2 flex justify-between items-center">
                                          <p>
                                            {mealType.charAt(0).toUpperCase() +
                                              mealType.slice(1)}
                                          </p>
                                          <p className="text-gray-700 mb-2">
                                            <span
                                              role="img"
                                              aria-label="Fire Emoji"
                                            >
                                              🔥
                                            </span>
                                            {meal[mealType].calories} kcal
                                          </p>
                                        </div>
                                        <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                                          <Image
                                            layout="fill"
                                            objectFit="cover"
                                            src={meal[mealType].image}
                                            alt={`Image for ${meal[mealType].title}`}
                                            className="mb-2 rounded-md border-2 border-gray-100"
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                            }}
                                          />
                                        </div>
                                        {/* Ingredients */}
                                        <div className="w-full mb-2 rounded-md">
                                          <p
                                            className="text-lg text-white mb-1 mt-2 cursor-pointer bg-blue-500 px-2 py-2 rounded-md"
                                            onClick={() =>
                                              toggleIngredients(
                                                dateString,
                                                mealType
                                              )
                                            }
                                          >
                                            Ingredients
                                          </p>
                                          {expandedIngredients[dateString] &&
                                            expandedIngredients[dateString][
                                              mealType
                                            ] && (
                                              <div className="pl-2">
                                                {meal[mealType].ingredients.map(
                                                  (ingredient, index) => (
                                                    <li key={index}>
                                                      {ingredient
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        ingredient.slice(1)}
                                                    </li>
                                                  )
                                                )}
                                              </div>
                                            )}
                                        </div>
                                        {/* Instructions */}
                                        <div className="w-full mb-2 rounded-md">
                                          <p
                                            className="text-lg text-gray-600 mb-1 mt-2 cursor-pointer bg-gray-300 px-2 py-2 rounded-md"
                                            onClick={() =>
                                              toggleInstructions(
                                                dateString,
                                                mealType
                                              )
                                            }
                                          >
                                            Instructions
                                          </p>
                                          {expandedInstructions[dateString] &&
                                            expandedInstructions[dateString][
                                              mealType
                                            ] && (
                                              <div className="mb-4 px-2 py-2">
                                                <ol className="list-decimal pl-4">
                                                  {meal[
                                                    mealType
                                                  ].instructions.full
                                                    .split(". ")
                                                    .map(
                                                      (instruction, index) => (
                                                        <li key={index}>
                                                          {instruction}
                                                        </li>
                                                      )
                                                    )}
                                                </ol>
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="h-full grid place-items-center">
                <CircularProgress />
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
        </>
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <CircularProgress />
        </div>
      )}
    </main>
  );
};

export default MealHistory;
