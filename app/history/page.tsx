'use client'

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db } from './../firebase';

import { Snackbar } from '@mui/material';

import Header from './../components/header';
import withAuth from './../withAuth';

interface Meal {
  date: Timestamp;
  email: string;
  meal: string;
  period: string;
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
        where('email', '==', userEmail)
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
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-xl mb-3">
                {meal.date.toDate().toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })} | {meal.period.charAt(0).toUpperCase() + meal.period.slice(1)}
              </h2>
              {/* //todo change with full meal details */}
              {/* <img src={} alt={} className="mb-2 rounded-md" /> */}
              <h3 className="text-lg font-semibold mb-2">
                {meal.meal}
              </h3>
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
