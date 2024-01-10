'use client'

import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import FoodCard from './../components/foodCard';
import { db, auth } from './../firebase';

import Header from './../components/header';

import withAuth from './../withAuth';

// todo: Server data
type Meal = {
    name: string;
    image: string;
    description: string;
    ingredients: string[];
};

type MealDay = {
    date: string;
    period: string;
    meals: Meal[];
};

//todo: Server data
type MealHistoryDocument = {
    userEmail: string;
    mealHistory: MealDay[];
};

const MealHistory = () => {
    const [mealHistory, setMealHistory] = useState<MealDay[]>([]);
  
    useEffect(() => {
      const fetchMealHistory = async () => {
        const uid = auth.currentUser?.uid;
        if (uid) {
          const userDocRef = doc(db, 'users', uid);
          const userDocSnapshot = await getDoc(userDocRef);
  
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data() as MealHistoryDocument;
            setMealHistory(userData.mealHistory || []);
          }
        }
      };
      fetchMealHistory();
    }, []);
  
    return (
      <main className="flex min-h-screen flex-col bg-gray-800">
        <Header />
  
        <section className="mt-8 ml-9 mr-9">
          <h1 className="text-4xl font-semibold text-white mb-6">Meal History</h1>
  
          {mealHistory.map((mealEntry, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">{mealEntry.date}</h2>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mealEntry.meals.map((meal, mealIndex) => (
                  <FoodCard
                    key={mealIndex}
                    name={meal.name}
                    image={meal.image}
                    description={meal.description}
                    ingredients={meal.ingredients}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    );
  };
  
  export default withAuth(MealHistory);