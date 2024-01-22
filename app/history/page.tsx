'use client'

import { useEffect, useState } from 'react';
import { collection, orderBy, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db } from './../firebase';

import { Snackbar } from '@mui/material';

import Header from './../components/header';
import withAuth from './../withAuth';
import Image from 'next/image';

interface Meal {
  date: Timestamp;
  email: string;
  meal: string;
  period: string;
  calories: number;
  instructions: string;
  ingredients: string[];
}

const MealHistory = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const userEmail = auth.currentUser?.email;
    if (userEmail) {
      const q = query(
        collection(db, 'mealHistory'),
        where('email', '==', userEmail),
        orderBy('date', 'desc'), 
      );

      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.log('No history found.');
            return;
          }

          const mealData = querySnapshot.docs.map((doc) => doc.data() as Meal);
          setMeals(mealData);
        } catch (error) {
          setError('Error fetching history: ' + error.message);
          setSnackbarOpen(true);
        }
      };

      fetchData();
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-gray-800">
      <Header />
      <section className="mt-8 ml-9 mr-9">
        <h1 className="text-4xl font-semibold text-white mb-6">Meal History</h1>
        {meals.map((meal, index) => (
          <div key={index}>
            <div className="bg-white p-4 mb-4 rounded-md shadow-md">
              <h2 className="text-xl mb-3">
                {meal.date.toDate().toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })} | {meal.period.charAt(0).toUpperCase() + meal.period.slice(1)}
              </h2>
              <Image
                src={'image.jpg'}
                alt={`Image for ${meal.meal}`}
                className="mb-2 rounded-md"
                style={{ maxHeight: '200px' }} 
              />
              <h3 className="text-lg font-semibold mb-2">
                {meal.meal}
              </h3>
              <p className="text-gray-700 mb-2">Calories: {meal.calories}</p>
              <p className="text-gray-700 mb-2">Instructions: {meal.instructions}</p>
              <p className="text-gray-700 mb-2">Ingredients: {meal.ingredients}</p>
            </div>
          </div>
        ))}
      </section>
      {/* Snackbar for displaying errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={error || ''}
      />
    </main>
  );
};

export default withAuth(MealHistory);