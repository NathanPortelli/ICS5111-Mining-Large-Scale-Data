import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { doc, getDoc, updateDoc, collection, setDoc } from 'firebase/firestore';
import { auth, db } from './../firebase';

import { Snackbar } from '@mui/material';
import FoodCard from './foodCard';

const FoodMenu: FC = () => {
    return (
      <main className="flex min-h-screen flex-col justify-center bg-gray-800">
        <h1 className="mt-8 mb-2 text-4xl font-semibold text-white">Food Menu</h1>
        <p className="text-xl text-white">Pick one meal from each menu:</p>
  
        {/* Morning Section */}
        <div className="mt-8 bg-yellow-200 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Morning Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {morningMenuItems.map((item) => (
              <FoodCard key={item.id} {...item} />
            ))}
          </div>
        </div>
  
        {/* Lunch Section */}
        <div className="mt-8 bg-green-200 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lunch Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lunchMenuItems.map((item) => (
              <FoodCard key={item.id} {...item} />
            ))}
          </div>
        </div>
  
        {/* Dinner Section */}
        <div className="mt-8 bg-purple-200 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Dinner Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dinnerMenuItems.map((item) => (
              <FoodCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </main>
    );
  };
  
// Data Structure
interface FoodMenuItem {
    id: string;
    name: string;
    image: string;
    description: string;
    ingredients: string[];
}

// todo: Replace with server data
const morningMenuItems: FoodMenuItem[] = [
    { id: '1', name: 'Coco Pops', image: 'morning.jpg', description: 'Breakfast option', ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'] },
];

const lunchMenuItems: FoodMenuItem[] = [
    { id: '4', name: '16oz steak with fries', image: 'lunch.jpg', description: 'Lunch option', ingredients: ['Ingredient 4', 'Ingredient 5', 'Ingredient 6'] },
];

const dinnerMenuItems: FoodMenuItem[] = [
    { id: '7', name: 'Cheese Grazed Burger', image: 'dinner.jpg', description: 'Dinner option', ingredients: ['Ingredient 7', 'Ingredient 8', 'Ingredient 9'] },
];
  
export default FoodMenu;