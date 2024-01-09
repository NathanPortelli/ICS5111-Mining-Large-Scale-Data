import React from 'react';

interface FoodCardProps {
  name: string;
  image: string;
  description: string;
  ingredients: string[];
}

const FoodCard: React.FC<FoodCardProps> = ({ name, image, description, ingredients }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <img src={image} alt={name} className="mb-2 rounded-md" />
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-gray-700 mb-2">{description}</p>
      <ul className="list-disc ml-4">
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-600">
        Pick Meal
      </button>
    </div>
  );
};

export default FoodCard;