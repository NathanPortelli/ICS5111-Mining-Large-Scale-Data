import Image from 'next/image';
import React from 'react';
import { FC } from 'react';

interface FoodCardProps {
  id: string;
  title: string;
  image: string;
  calories: string;
  selected: boolean;
  alternate: boolean;
}

const FoodCard: FC<FoodCardProps> = ({ id, title, image, calories, selected, alternate }) => {
  const borderColorClass = selected
    ? 'border-red-500' // selected
    : alternate
    ? 'border-green-700' // alternate
    : 'border-transparent'; // if neither selected nor alternate

  return (
    <div className={`bg-white p-4 rounded-md shadow-md border-4 ${borderColorClass} rounded-md p-4 mb-4`}>
      <div className="relative w-full h-48 mb-2 rounded-md overflow-hidden">
        <Image src={image} alt={title} layout="fill" objectFit="cover" />
      </div>
      {/* <ul className="list-disc ml-4">
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul> */}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-2">Calories: {calories}</p>
    </div>
  );
};

export default FoodCard;
