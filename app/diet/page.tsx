'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import Header from './../components/header';
import Preferences from './../components/preferences';
import PersonalDetails from './../components/personalDetails';
import FoodMenu from './../components/foodMenu';

import withAuth from './../withAuth';

const Recommender = () => {
  const { register, handleSubmit } = useForm();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [recommendedKcal, setRecommendedKcal] = useState(0);
  const [goal, setGoal] = useState("");

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
      <div className='items-center justify-center ml-9 mr-9 mb-9'>
      <div className="flex items-center mb-4">
        <div className="w-20 h-20 mb-7 mr-3 flex items-center justify-center text-white font-semibold text-3xl bg-blue-500 rounded-full">1</div>
        <div className="flex flex-col">
          <h1 className="mb-1 text-4xl font-semibold text-white">Your Details</h1>
          <p className="text-xl ml-1 text-white mb-5">Please ensure that the following information is accurate.</p>
        </div>
      </div>
        <div className="mb-2 pl-9 pr-9 p-2 border-2 bg-gray-600 rounded-md shadow-md">
          <div className="mb-5 flex flex-wrap justify-center">
            {/* Personal Information Section */}
            <div className="flex flex-col items-center mb-2 w-full max-w-xl md:w-1/2 md:pr-4">
              <div className="mt-6 gap-8 w-full text-center bg-black rounded-md shadow-md">
                <h3 className="mt-3 text-2xl font-semibold mb-3 text-white">Personal Details</h3>
              </div>
              <div className='mx-auto w-full max-w-xl'>
                <PersonalDetails />
              </div>
            </div>
            {/* Food Preferences Section */}
            <div className="flex flex-col items-center mb-2 w-full max-w-xl md:w-1/2 md:pr-4">
              <div className="mt-6 gap-8 w-full text-center bg-black rounded-md shadow-md">
                <h3 className="mt-3 text-2xl font-semibold mb-3 text-white">Food Preferences</h3>
              </div>
              <div className='mx-auto w-full max-w-xl'>
                <Preferences />
              </div>
            </div>
          </div>
        </div>
        {/* Goals Section */}
        <div className="mt-8 flex items-center mb-3">
          <div className="w-20 h-20 mb-7 mr-3 flex items-center justify-center text-white font-semibold text-3xl bg-blue-500 rounded-full">2</div>
          <div className="flex flex-col">
            <h1 className="mb-1 text-4xl font-semibold text-white">Goals</h1>
            <p className="text-xl ml-1 text-white mb-5">Choose your diet plan.</p>
          </div>
        </div>  
        <div className="p-5 border-2 bg-gray-600 rounded-md shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Weight Loss', 'Weight Gain', 'Maintain'].map((goalOption) => (
              <div key={goalOption} className="rounded-md shadow-md text-center">
                <button
                  type="button"
                  className={`w-full text-2xl px-4 py-2 ${goal === goalOption ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'} rounded-md transition duration-300 hover:opacity-70`}
                  onClick={() => openDropdown(goalOption)}
                >
                  {goalOption} {goalOption === 'Weight Loss' ? '🔥' : goalOption === 'Weight Gain' ? '🍖' : '⚖️'}
                </button>
              </div>
            ))}
          </div>
          <div className='w-full'>
            {showDropdown && (
              <div className="bg-white p-6 rounded-md shadow-md mt-4">
                <p className="mb-4 text-xl text-gray-800 font-semibold">
                  For {goal}, the recommended calories are: <b>{recommendedKcal}</b> kcal
                </p>
                <label htmlFor="calories" className="block mb-2 text-gray-800 font-semibold">
                  Set alternate calories (kcal) goal:
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
                  className="w-full text-xl font-bold px-4 py-2 bg-green-500 text-white rounded-md transition duration-300 hover:opacity-70 mt-4"
                  onClick={() => onSubmit()}
                >
                  Start
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showFoodMenu && (
      <div className='ml-9 mr-9 mb-9'>
        <div className="flex items-center mb-4">
          <div className="w-20 h-20 mb-7 mr-3 flex items-center justify-center text-white font-semibold text-3xl bg-blue-500 rounded-full">3</div>
          <div className="flex flex-col">
            <h1 className="mb-1 text-4xl font-semibold text-white">Food Recommendations</h1>
            <p className="text-xl ml-1 text-white mb-5">Pick one meal from each menu.</p>
          </div>
        </div>  
        <p className="text-xl ml-1 text-white mb-5">Options for: <b>{recommendedKcal} kcal</b></p>
        <div className="border-2 bg-gray-600 rounded-md shadow-md">
          <div className="p-5 justify-center">
            <FoodMenu />
          </div>
        </div>
      </div>
      )}
    </main>
  );
}

export default withAuth(Recommender);