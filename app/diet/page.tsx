'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import Header from './../components/header';
import Preferences from './../components/preferences';
import PersonalDetails from './../components/personalDetails';
import FoodMenu from './../components/foodMenu';
import { NextPage } from 'next';

import { auth, db } from './../firebase';
import { doc, getDoc } from 'firebase/firestore';

import withAuth from './../withAuth';

const Recommender = () => {
  const { register, handleSubmit } = useForm();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [recommendedKcal, setRecommendedKcal] = useState(0);
  const [goal, setGoal] = useState("");

  const router = useRouter();
  const isLoggedIn = auth.currentUser !== null; // Check if user is logged in
  // If user is not logged in
  if (!isLoggedIn) {
    router.replace('/credentials');
    return null; // Prevent rendering rest
  }

  const onSubmit = () => {
    setShowFoodMenu(true);
  };

  const openDropdown = (goal) => {
    setShowDropdown(true);
    setGoal(goal);
    setRecommendedKcal(1500);
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-800">
      <Header />
      <h1 className="mt-8 text-6xl font-semibold text-white mb-6 text-center">Personalised Diet Recommender</h1>
      <h1 className="mt-8 mb-1 text-4xl font-semibold text-white ml-9">Your Details</h1>
      <div className='items-center justify-center ml-9 mr-9 mb-9'>
        <p className="text-xl text-white mb-5">Please ensure that the following information is accurate.</p>
        <div className="mb-2 pl-9 pr-9 p-2 border-2 bg-gray-600 rounded-md shadow-md">
          <div className="mb-5 flex flex-wrap justify-center">
            {/* Personal Information Section */}
            <div className="flex flex-col items-center mb-2 w-full max-w-xl md:w-1/2 md:pr-4"> {/* Adjust max-w-xl */}
              <h3 className="mt-6 text-2xl font-semibold mb-3 text-white">Personal Details</h3>
              <div className='mx-auto w-full max-w-xl'> {/* Adjust max-w-xl */}
                <PersonalDetails />
              </div>
            </div>
            {/* Food Preferences Section */}
            <div className="flex flex-col items-center mb-2 w-full max-w-xl md:w-1/2 md:pl-4"> {/* Adjust max-w-xl */}
              <h3 className="mt-6 text-2xl font-semibold mb-3 text-white">Food Preferences</h3>
              <Preferences />
            </div>
          </div>
        </div>
        {/* Goals Section */}
        <h3 className="mt-8 text-3xl font-semibold text-white">Goals</h3>
        <p className="text-xl mb-4 text-white">Choose your diet plan.</p>
        <div className="grid grid-cols-1 mb-4 md:grid-cols-3 gap-6">
          {['Weight Loss', 'Weight Gain', 'Maintain'].map((goal) => (
            <div key={goal} className="rounded-md shadow-md text-center">
              <button
                type="button"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-600"
                onClick={() => openDropdown(goal)}
              >
                {goal} {goal === 'Weight Loss' ? '🔥' : goal === 'Weight Gain' ? '🍖' : '⚖️'}
              </button>
            </div>
          ))}
          

          {showDropdown && (
            <div className="bg-white p-6 rounded-md shadow-md mt-2 mb-6">
              <p className="mb-4 text-gray-800 font-semibold">
                For {goal}, the recommended calories are: {recommendedKcal} kcal.
              </p>
              <label htmlFor="calories" className="block mb-2 text-gray-800 font-semibold">
                Set Calories (kcal):
              </label>
              <input
                id="calories"
                type="number"
                defaultValue={recommendedKcal}
                {...register('calories', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-600 mt-4"
                onClick={() => onSubmit()}
              >
                Start
              </button>
            </div>
          )}
        </div>
      </div>
      {showFoodMenu && (
      <div className='ml-9 mr-9 mb-9'>
        <FoodMenu />
      </div>
      )}
    </main>
  );
}

export default withAuth(Recommender);