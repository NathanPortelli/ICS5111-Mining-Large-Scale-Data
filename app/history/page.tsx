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

const groupMealsByDate = (meals: Meal[]) => {
  const groupedMeals: { [date: string]: Meal[] } = {};

  meals.forEach((meal) => {
    const dateString = meal.date.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    if (!groupedMeals[dateString]) {
      groupedMeals[dateString] = [];
    }

    groupedMeals[dateString].push(meal);
  });

  return groupedMeals;
};

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

  const groupedMeals = groupMealsByDate(meals);

  return (
    <main className="flex flex-col bg-gray-800">
      <section className="mt-8 ml-9 mr-9">
        <h1 className="text-4xl font-semibold text-white mb-6">Meal History</h1>
        {Object.keys(groupedMeals).map((dateString, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl text-white mb-4">{dateString}</h2>
            <div className="flex flex-wrap">
              {groupedMeals[dateString].map((meal, mealIndex) => (
                <div key={mealIndex}>
                  <div className="pt-4 mb-4 flex">
                    {['breakfast', 'lunch', 'dinner'].map((mealType) => (
                    <div key={mealType} className='bg-white rounded-md shadow-md mr-6 p-5 flex-grow'>
                      <h3 className="text-lg font-semibold mb-2">
                          {meal[mealType]}
                      </h3>
                      <div className="text-gray-700 mb-2">
                          <p>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</p>
                      </div>
                      <Image
                          width={200}
                          height={300}
                          src={''} 
                          alt={`Image for ${meal[mealType]}`}
                          className="mb-2 rounded-md"
                          style={{ maxHeight: '200px' }} 
                      />
                      <p className="text-gray-700 mb-2">Calories: {meal[mealType.charAt(0) + '_calories']}</p>
                      <p className="text-gray-700 mb-2">Instructions: {meal[mealType.charAt(0) + '_instructions']}</p>
                      <p className="text-gray-700 mb-2">Ingredients: {meal.ingredients}</p>
                    </div>
                    ))}
                  </div>
                </div>
              ))}
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
