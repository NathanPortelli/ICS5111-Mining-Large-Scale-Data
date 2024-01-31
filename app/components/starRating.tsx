import React, { useState } from "react";

const StarRating = ({ handleRating }) => {
  const [rating, setRating] = useState(0);

  const handleClick = (value) => {
    setRating(value);
    handleRating(value);
  };

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`cursor-pointer text-6xl ${
            index < rating ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => handleClick(index + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
