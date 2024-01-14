import React from 'react';
import { FC } from 'react';

interface FoodCardProps {
  id: string;
  name: string;
  image: string;
  calories: string;
  // description: string;
  // ingredients: string[];
  selected: boolean;
}

const FoodCard: FC<FoodCardProps> = ({ id, name, image, calories, selected }) => {
  return (
    <div className={`bg-white p-4 rounded-md shadow-md border-4 ${selected ? 'border-red-500' : 'border-transparent'} rounded-md p-4 mb-4`}>
      <img src={image} alt={name} className="mb-2 rounded-md" />
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-gray-700 mb-2">Calories: {calories}</p>
      {/* <ul className="list-disc ml-4">
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default FoodCard;
