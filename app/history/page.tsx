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

import Image from "next/image";
import { useUser } from "../hooks/user";
import { RecipeAPIResponse } from "../interfaces/recipeAPIResponse";
import { GET } from "../utils/api";
import withAuth from "./../withAuth";

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
  const [groupedMeals, setGroupedMeals] = useState<{
    [date: string]: GroupMeal[];
  } | null>(null);

  const { uid } = useUser();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (uid) {
      fetchData(uid);
    }
  }, [uid]);

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
      meals.forEach(async (meal) => {
        const dateString = meal.date.toDate().toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        if (!groupedMeals[dateString]) {
          groupedMeals[dateString] = [];
        }

        const breakfast = (await GET(baseRecipeUrl + meal.breakfast)).json();
        const lunch = (await GET(baseRecipeUrl + meal.lunch)).json();
        const dinner = (await GET(baseRecipeUrl + meal.dinner)).json();

        await Promise.all([breakfast, lunch, dinner]).then((values) => {
          groupedMeals[dateString].push({
            breakfast: values[0],
            lunch: values[1],
            dinner: values[2],
          });
        });
      });
    } catch (error) {
      console.log("Error fetching recipe: ", error.message);
    } finally {
      return groupedMeals;
    }
  };

  return (
    <main className="flex flex-col bg-gray-800">
      <section className="mt-8 ml-9 mr-9">
        <h1 className="text-4xl font-semibold text-white mb-6">Meal History</h1>
        {!loading && groupedMeals && Object.keys(groupedMeals).length > 0 ? (
          <>
            {Object.keys(groupedMeals).map((dateString, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl text-white mb-4">{dateString}</h2>
                <div className="flex flex-wrap">
                  {groupedMeals[dateString].map((meal, mealIndex) => (
                    <div key={mealIndex}>
                      <div className="pt-4 mb-4 flex">
                        {["breakfast", "lunch", "dinner"].map((mealType) => (
                          <div
                            key={mealType}
                            className="bg-white rounded-md shadow-md mr-6 p-5 flex-grow"
                          >
                            <h3 className="text-lg font-semibold mb-2">
                              {meal[mealType].title}
                            </h3>
                            <div className="text-gray-700 mb-2">
                              <p>
                                {mealType.charAt(0).toUpperCase() +
                                  mealType.slice(1)}
                              </p>
                            </div>
                            <Image
                              width={200}
                              height={300}
                              src={meal[mealType].image}
                              alt={`Image for ${meal[mealType]}`}
                              className="mb-2 rounded-md"
                              style={{ maxHeight: "200px" }}
                            />
                            <p className="text-gray-700 mb-2">
                              Calories: {meal[mealType].calories} Test
                            </p>
                            <p className="text-gray-700 mb-2">
                              Instructions: {meal[mealType].instructions.full}
                            </p>
                            <p className="text-gray-700 mb-2">
                              Ingredients: {meal[mealType].ingredients}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          "Loading"
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

export default withAuth(MealHistory);
