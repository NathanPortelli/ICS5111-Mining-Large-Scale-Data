'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import Header from './components/header';
import Preferences from './components/preferences';
import PersonalDetails from './components/personalDetails';
import { NextPage } from 'next';

import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Home() {
  const { register, handleSubmit } = useForm();
  const [showDropdown, setShowDropdown] = useState(false);
  const [recommendedKcal, setRecommendedKcal] = useState(0);
  const [goal, setGoal] = useState("");

  const onSubmit = () => {
    // Handle form submission logic
  };

  const openDropdown = (goal) => {
    setShowDropdown(true);
    setGoal(goal);
    setRecommendedKcal(1500);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center"> 
      <Header />
      {/* Personal Information Section */}
      <h2 className="mt-8 text-2xl font-semibold mb-4 text-white">Personal Details</h2>
      <div className='mx-auto w-full max-w-md'>
        <PersonalDetails />
      </div>

      {/* Food Preferences Section */}
      <h2 className="mt-8 text-2xl font-semibold mb-4 text-white">Food Preferences</h2>
      <Preferences />
  
      {/* Goals Section */}
      <h2 className="mt-8 text-2xl font-semibold mb-4 text-white">Goals</h2>
      <div className="mb-16">
        <div className="grid grid-cols-3 gap-4">
        {['Weight Loss', 'Weight Gain', 'Maintain'].map((goal) => (
            <button
              key={goal}
              type="button"
              className="w-full p-2 bg-blue-500 text-white rounded transition duration-300 hover:bg-blue-600"
              onClick={() => openDropdown(goal)}
            >
              {goal} {goal === 'Weight Loss' ? '🏋️‍♂️' : goal === 'Weight Gain' ? '🏋️‍♀️' : '⚖️'}
            </button>
          ))}
        </div>
      </div>
      {showDropdown && (
        <div className="mb-6">
          <p className="mb-2 font-semibold text-white">
            For {goal}, the recommended calories are: {recommendedKcal} kcal.
          </p>
          <label htmlFor="calories" className="block mb-2 font-semibold text-white">
            Set Calories (kcal):
          </label>
          <input
            id="calories"
            type="number"
            defaultValue={recommendedKcal}
            {...register('calories', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
          <button type="button" className="bg-blue-500 text-white p-2 rounded mt-2">
            Start
          </button>
        </div>
      )}
    </main>
  );
}